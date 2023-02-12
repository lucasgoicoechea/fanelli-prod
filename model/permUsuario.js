const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const _ = require('lodash')

const PermUsuarioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  perm: {
    type: Schema.Types.ObjectId,
    ref: 'Perm'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const PermUsuarioModel = mongoose.model('PermUsuario', PermUsuarioSchema)
module.exports = PermUsuarioModel
