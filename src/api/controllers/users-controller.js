const usersService = require('../services/users-service')
const { validationResult } = require('express-validator')

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll({}, '-password')
    res.send({ users })
  } catch (error) {
    return next(error)
  }
}

const signUp = async (req, res, next) => {
  try {
    const body = {
      ...req.body,
      image: req.file.path
    }
    const user = await usersService.create(body, validationResult(req))
    const token = usersService.createAccessToken(user.id, '2 days')
    res.status(201).send({ userId: user.id, token })
  } catch (error) {
    return next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await usersService.login(req.body)
    const token = usersService.createAccessToken(user.id, '2 days')
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
