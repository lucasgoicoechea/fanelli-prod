const path = require('path')
const mongoose = require(path.join(__dirname, '../mongoConnection')).getMongoose()
const constant = require(path.join(__dirname, '../libs/const'))
const Schema = mongoose.Schema

const FailedSchema = new Schema({
  text: {
    type: String,
    require: true
  },
  father: {
    type: String,
    require: false
  }
})

const FailedModel = mongoose.model('Failed', FailedSchema)
//mongoose.set('debug', true)
module.exports = FailedModel
