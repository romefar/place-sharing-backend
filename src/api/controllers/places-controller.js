const { validationResult } = require('express-validator')
const placesService = require('../services/places-service')

const getPlaceById = async (req, res, next) => {
  try {
    const { pid } = req.params
    const place = await placesService.getById(pid)
    res.send({ place })
  } catch (error) {
    return next(error)
  }
}

const getPlacesByUserId = async (req, res, next) => {
  try {
    const { uid } = req.params
    const places = await placesService.getAll({ creatorId: uid })
    res.send({ places })
  } catch (error) {
    return next(error)
  }
}

const createPlace = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      image: req.file.path,
      creatorId: req.userData.userId
    }
    const createdPlace = await placesService.create(body, validationResult(req))
    res.status(201).send({ place: createdPlace })
  } catch (error) {
    return next(error)
  }
}

const updatePlace = async (req, res, next) => {
  try {
    const { userId } = req.userData
    const { title, description } = req.body
    const { pid } = req.params
    const updatedPlace = await placesService.update({ _id: pid, creatorId: userId }, { title, description }, validationResult(req))
    res.send({ place: updatedPlace })
  } catch (error) {
    return next(error)
  }
}

const deletePlace = async (req, res, next) => {
  try {
    const { pid } = req.params
    const { userId } = req.userData
    const place = await placesService.delete(pid, userId)
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
