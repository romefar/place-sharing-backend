const User = require('../../models/user')
const BaseRepository = require('./base-repository')

class UsersRepository extends BaseRepository {
  constructor () {
    super(User)
  }
}

module.exports = new UsersRepository()
