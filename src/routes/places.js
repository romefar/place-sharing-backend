const express = require('express')
const { check } = require('express-validator')
const router = express.Router()
const chekAuth = require('../middleware/check-auth')
const fileUpload = require('../middleware/file-upload')
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/places')

router.get(
  '/:pid',
  getPlaceById
)

router.get(
  '/user/:uid',
  getPlacesByUserId
)

router.post(
  '/',
  chekAuth,
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
  ],
  createPlace)

router.patch(
  '/:pid',
  chekAuth,
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  updatePlace)

router.delete(
  '/:pid',
  chekAuth,
  deletePlace)

module.exports = router
