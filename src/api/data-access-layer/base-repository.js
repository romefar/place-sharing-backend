class BaseRepository {
  constructor (model) {
    this.model = model
  }

  async getAll (excludeFields) {
    return await this.model.find({}, excludeFields)
  }

  async getByCriteria (options) {
    return await this.model.findOne(options)
  }

  async getManyByCriteria (options) {
    return await this.model.find(options)
  }

  async getById (id) {
    return await this.model.findById(id)
  }

  async delete (options) {
    return await this.model.findOneAndDelete(options)
  }

  async create (data) {
    return await this.model.create(data)
  }

  async update (conditionObject, updateObject) {
    return await this.model.findOneAndUpdate(conditionObject, updateObject)
  }
}

module.exports = BaseRepository
