const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const availabilitySchema = new Schema({
  collaborator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  collectionRequest: {
    type: String
  },
  request: {type: Schema.Types.ObjectId, refPath: 'collectionRequest'},
  isAvailable: {
    type: Boolean
  },
  time: {
    from: {
      type: String
    },
    to: {
      type: String
    }
  },
  type: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

const availabilityModel = mongoose.model('availability', availabilitySchema)
module.exports = availabilityModel
