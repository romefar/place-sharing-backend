const placesRepository = require('../data-access-layer/places-respository')
const usersRepository = require('../data-access-layer/users-repository')
const BaseService = require('../services/base-service')
const HttpError = require('../../models/http-error')
const fs = require('fs')
const geocode = require('../../geocoding/forward-geo')

class PlacesService extends BaseService {
  constructor () {
    super(placesRepository)
  }

  async getById (pid) {
    const place = await this.repository.getById(pid)

    if (!place) {
      throw new HttpError('Couldn\'t find a place for the provided id.', 404)
    }

    return place.toObject({ getters: true })
  }

  async getAll (options) {
    const places = await this.repository.getManyByCriteria(options)

    if (!places) {
      throw new HttpError('Couldn\'t find places for the provided user id.', 404)
    }

    return places.map(p => p.toObject({ getters: true }))
  }

  async create (data, validator) {
    if (!validator.isEmpty()) {
      throw new HttpError('Invalid inputs passed.', 422)
    }
    const { title, description, address, image, creatorId } = data

    const user = await usersRepository.getById(creatorId)
    if (!user) {
      throw new HttpError('Could\'t find a user.', 404)
    }

    // forward geocoding with opencage API
    const location = await geocode(address)

    const createdPlace = await this.repository.create({
      title,
      description,
      address,
      image,
      creatorId,
      location
    }, user)

    return createdPlace
  }

  async update (conditionObject, data, validator) {
    if (!validator.isEmpty()) {
      throw new HttpError('Invalid inputs passed.', 422)
    }
    const updatedPlace = await this.repository.update(conditionObject, data)
    if (!updatedPlace) {
      throw new HttpError('Couldn\'t find a place for that id.', 404)
    }

    return updatedPlace
  }

  async delete (pid, uid) {
    const place = await this.repository.getByCriteria({ _id: pid, creatorId: uid })
    if (!place) {
      throw new HttpError('Couldn\' find a place for that id.', 404)
    }
    const deletedPlace = await this.repository.delete(pid, uid)
    const imagePath = place.image
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log(err)
      }
    })
    return deletedPlace
  }
}

module.exports = new PlacesService()
