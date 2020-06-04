const HttpError = require('../models/http-error')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/user')
require('dotenv/config')

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
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.path,
      places: []
    })

    await user.save()

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '2 days' })

    res.status(201).send({ userId: user.id, token })
  } catch (error) {
    return next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw new HttpError('Couldn\'t identify a user.', 401)
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new HttpError('Couldn\'t identify a user.', 401)
    }
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '2 days' })
    res.send({ userId: user.id, token })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  signUp,
  login,
  getUsers
}
