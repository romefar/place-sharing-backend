const HttpError = require('../models/http-error')
const Place = require('../models/place')
const User = require('../models/user')
const { startSession } = require('mongoose')
const { validationResult } = require('express-validator')

const getPlaceById = async (req, res, next) => {
  try {
    const { pid } = req.params
    const place = await Place.findById(pid)

    if (!place) {
      throw new HttpError('Couldn\'t find a place for the provided id.', 404)
    }

    res.send({ place: place.toObject({ getters: true }) })
  } catch (error) {
    return next(error)
  }
}

const getPlacesByUserId = async (req, res, next) => {
  try {
    const { uid } = req.params
    const places = await Place.find({ creatorId: uid })

    if (!places) {
      throw new HttpError('Couldn\'t find places for the provided user id.', 404)
    }

    res.send({ places: places.map(p => p.toObject({ getters: true })) })
  } catch (error) {
    return next(error)
  }
}

const createPlace = async (req, res, next) => {
  let createdPlace = null
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed.', 422)
    }
    const { title, description, address, creatorId } = req.body
    createdPlace = new Place({
      title,
      description,
      address,
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Looking_Up_at_Empire_State_Building.JPG',
      location: { // Replace with a geocoder later (OpenCage or etc.)
        lat: 40.7484445,
        lng: -73.9878531
      },
      creatorId
    })

    const user = await User.findById(creatorId)
    if (!user) {
      throw new HttpError('Could\'t find a user.', 404)
    }

    // Transactions example
    // You MUST create a 'places' collection manually
    // if it does not exist otherwise MongoDB will
    // throw an error
    const session = await startSession()
    session.startTransaction()
    await createdPlace.save({ session })
    user.places.push(createdPlace)
    await user.save({ session })
    await session.commitTransaction()
  } catch (error) {
    return next(error)
  }

  res.status(201).send({ place: createdPlace })
}

const updatePlace = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed.', 422)
    }
    const { title, description } = req.body
    const { pid } = req.params

    const updatedPlace = await Place.findByIdAndUpdate(pid, { title, description })

    if (!updatedPlace) {
      throw new HttpError('Couldn\'t find a place for that id.', 404)
    }

    res.send({ place: updatedPlace })
  } catch (error) {
    return next(error)
  }
}

const deletePlace = async (req, res, next) => {
  try {
    const { pid } = req.params
    const place = await Place
      .findById(pid)
      .populate('creatorId')

    if (!place) {
      throw new HttpError('Couldn\' find a place for that id.', 404)
    }

    // Transactions example
    // You MUST create a 'places' collection manually
    // if it does not exist otherwise MongoDB will
    // throw an error
    const session = await startSession()
    session.startTransaction()
    await place.remove({ session })
    place.creatorId.places.pull(place)
    await place.creatorId.save({ session })
    await session.commitTransaction()

    res.send({ place })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
}
