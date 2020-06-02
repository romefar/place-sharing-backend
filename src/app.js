const express = require('express')
const HttpError = require('./models/http-error')
const dbConnect = require('./db/mongoose')

const placeRoute = require('./routes/places')
const usersRoute = require('./routes/users')

const app = express()

app.use(express.json())
app.use('/api/places', placeRoute)
app.use('/api/users', usersRoute)

app.use((req, res, next) => {
  next(new HttpError('Coudln\'t find reach this route.'), 404)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500).send({
    message: error.message || 'An unknows error occured.'
  })
})

const port = process.env.PORT || 3000

dbConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}\nDB is running.`)
    })
  })
  .catch(e => {
    console.log(`An error has occured while running the db. ${e.message}`)
  })
