const express = require('express')
const { check } = require('express-validator')
const fileUpload = require('../middleware/file-upload')
const router = express.Router()
const {
  signUp,
  login,
  getUsers
} = require('../controllers/users')

router.get('/', getUsers)
router.post('/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 7 })
  ], signUp)
router.post('/login', login)

module.exports = router
