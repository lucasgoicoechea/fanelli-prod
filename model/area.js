const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema

const AreaSchema = new Schema({
  value: {
    type: String,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const AreaModel = mongoose.model('Area', AreaSchema)
module.exports = AreaModel
