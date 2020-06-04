const express = require('express')
const HttpError = require('./models/http-error')
const dbConnect = require('./db/mongoose')
const fs = require('fs')
const path = require('path')
const placeRoute = require('./routes/places')
const usersRoute = require('./routes/users')

const app = express()

app.use(express.json())
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

// allow cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use('/api/places', placeRoute)
app.use('/api/users', usersRoute)

app.use((req, res, next) => {
  next(new HttpError('Coudln\'t reach this route.'), 404)
})

app.use((error, req, res, next) => {
  if (req.file) {
    // romeve file
    fs.unlink(req.file.path, (err) => {
      // add error handler
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500).send({
    message: error.message || 'An unknown error occured.'
  })
})

const port = process.env.PORT || 3001

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}\nDB is running.`)
    })
  })
  .catch(e => {
    console.log(`An error has occured while running the db. ${e.message}`)
  })
