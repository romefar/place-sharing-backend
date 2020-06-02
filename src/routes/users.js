const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const {
  signUp,
  login,
  getUsers
} = require('../controllers/users')

router.get('/', getUsers)
router.post('/signup', [
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 8 })
], signUp)
router.post('/login', login)

module.exports = router
