const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const constants = require(path.join(__dirname, '/../libs/const'))
const _ = require('lodash')

const RoleSchema = new Schema({
  code: {
    type: String,
    enum: _.values(constants.USER_TYPE)
  },
  name: {
    type: String,
    default: "permiso anonimo"
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const RoleModel = mongoose.model('Role', RoleSchema)
module.exports = RoleModel
