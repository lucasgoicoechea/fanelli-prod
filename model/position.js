const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema

const PositionSchema = new Schema({
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
const PositionModel = mongoose.model('Position', PositionSchema)
module.exports = PositionModel
