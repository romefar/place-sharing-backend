const HttpError = require('../models/http-error')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv/config')

const AUHT_FAILED_MSG = 'Authentication failed.'

module.exports = async (req, res, next) => {
  try {
    // ???
    if (req.method === 'OPTIONS') {
      return next()
    }
    const token = req.header('Authorization')
      ? req.header('Authorization').split(' ')[1] : null

    if (!token) {
      throw new Error(AUHT_FAILED_MSG)
    }
    const decodedUserData = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findById(decodedUserData.userId)
    if (!user) {
      throw new Error(AUHT_FAILED_MSG)
    }
    req.userData = { userId: decodedUserData.userId }
    next()
  } catch (error) {
    return next(new HttpError(error.message, 403))
  }
}
