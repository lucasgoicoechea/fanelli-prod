const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema

const RolePermSchema = new Schema({
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
const RolePermModel = mongoose.model('RolePerm', RolePermSchema)
module.exports = RolePermModel
