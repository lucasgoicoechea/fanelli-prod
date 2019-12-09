const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema

const SectorSchema = new Schema({
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
const SectorModel = mongoose.model('Sector', SectorSchema)
module.exports = SectorModel
