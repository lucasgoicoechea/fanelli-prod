const path = require('path')
const mongoose = require(path.join(__dirname, '../mongoConnection')).getMongoose()
const constant = require(path.join(__dirname, '../libs/const'))
const Schema = mongoose.Schema

const CheckLTresSchema = new Schema({
  text: {
    type: String,
    require: true
  },
  sector: {
    type: String,
    enum: Object.getOwnPropertyNames(constant.CHECKS_SECTOR).map(s => constant.CHECKS_SECTOR[s]),
    require: true
  },
  extra: {
    type: Boolean
  }
})

const CheckLTresModel = mongoose.model('Checksltres', CheckLTresSchema)

module.exports = CheckLTresModel
