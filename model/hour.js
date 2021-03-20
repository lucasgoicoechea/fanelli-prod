const path = require('path')
const mongoose = require(path.join(__dirname, '../mongoConnection')).getMongoose()
const Schema = mongoose.Schema

const HourSchema = new Schema({
  text: {
    type: String,
    require: true
  },
  schedule: {
    type: String,
    enum: ['MANIANA', 'TARDE', 'NOCHE'],
    default: 'MANIANA'
  },
  ordertime: {
    type: Number,
    default: 0
  }
})

const HourModel = mongoose.model('Hour', HourSchema)

module.exports = HourModel
