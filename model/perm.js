const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const constants = require(path.join(__dirname, '/../libs/const'))
const _ = require('lodash')

const PermSchema = new Schema({
  code: {
    type: String,
    enum: _.values(constants.USER_TYPE)
  },
  description: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const PermModel = mongoose.model('Perm', PermSchema)
module.exports = PermModel
