class BaseService {
  constructor (repository) {
    this.repository = repository
  }

  async getAll (excludeFields = null) {
    return await this.repository.find({}, excludeFields)
  }

  async getByCriteria (options) {
    return await this.repository.findOne(options)
  }

  async getById (id) {
    return await this.repository.findById(id)
  }

  async delete (id) {
    return await this.repository.findById(id)
  }

  async create (data) {
    return await this.repository.create(data)
  }

  async update (conditionObject, updateObject) {
    return await this.repository.findOneAndUpdate(conditionObject, updateObject)
  }
}

module.exports = BaseService
