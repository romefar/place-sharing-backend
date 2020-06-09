const usersRepository = require('../data-access-layer/users-repository')
const BaseService = require('../services/base-service')
const HttpError = require('../../models/http-error')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')

class UsersService extends BaseService {
  constructor () {
    super(usersRepository)
  }

  async getAll (excludeFields = null) {
    const users = await this.repository.getAll(excludeFields)

    if (!users) {
      throw new HttpError('Couldn\'t find places for the provided user id.', 404)
    }

    return users.map(u => u.toObject({ getters: true }))
  }

  async create (data, errors) {
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed.', 422)
    }
    const { name, email, password, image } = data

    const exUser = await this.repository.getByCriteria({ email })
    if (exUser) {
      throw new HttpError('User is already exists.', 422)
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const createdUser = await usersRepository.create({
      name,
      email,
      password: hashedPassword,
      image,
      places: []
    })

    return createdUser
  }

  createAccessToken (uid, expiresIn = '2 days') {
    return jwt.sign({ userId: uid }, process.env.SECRET_KEY, { expiresIn })
  }

  async login (data) {
    const { email, password } = data
    const user = await this.repository.getByCriteria({ email })
    if (!user) {
      throw new HttpError('Couldn\'t identify a user.', 401)
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new HttpError('Couldn\'t identify a user.', 401)
    }
    return user
  }
}

module.exports = new UsersService()
