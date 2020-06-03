const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-password')
    res.send({ users: users.map((user) => user.toObject({ getters: true })) })
  } catch (error) {
    return next(error)
  }
}

const signUp = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new HttpError('Invalid inputs passed.', 422)
    }
    const { name, email, password } = req.body
    const exUser = await User.findOne({ email })
    if (exUser) {
      throw new HttpError('User is already exists.', 422)
    }
    const user = new User({
      name,
      email,
      password,
      image: 'https://www.dovercourt.org/wp-content/uploads/2019/11/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.jpg',
      places: []
    })
    await user.save()
    res.status(201).send({ user: user.toObject({ getters: true }) })
  } catch (error) {
    return next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email, password })
    if (!user || user.password !== password) {
      throw new HttpError('Couldn\'t identify a user.', 401)
    }
    res.send({ message: 'Logged in.', user: user.toObject({ getters: true }) })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  signUp,
  login,
  getUsers
}
