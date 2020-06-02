const mongoose = require('mongoose')
require('dotenv/config')

module.exports = () => {
  const connection = mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  mongoose.set('useCreateIndex', true)
  return connection
}
