const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema

const PermUsuarioSchema = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
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
