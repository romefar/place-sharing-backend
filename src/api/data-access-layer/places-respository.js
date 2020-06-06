const Place = require('../../models/place')
const BaseRepository = require('./base-repository')
const { startSession } = require('mongoose')

class PlacesRepository extends BaseRepository {
  constructor () {
    super(Place)
  }

  async create (data, userModel) {
    const createdPlace = new Place(data)
    // Transactions example
    // You MUST create a 'places' collection manually
    // if it does not exist otherwise MongoDB will
    // throw an error
    const session = await startSession()
    session.startTransaction()
    await createdPlace.save({ session })
    userModel.places.push(createdPlace)
    await userModel.save({ session })
    await session.commitTransaction()

    return createdPlace
  }

  async delete (pid, uid) {
    const place = await this.model.findOne({ _id: pid, creatorId: uid }).populate('creatorId')
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

    return place
  }
}

module.exports = new PlacesRepository()
