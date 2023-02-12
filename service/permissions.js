const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const PermUsuarioModel = require(path.join(__dirname, '../model')).permUsuario
const PermRoleModel = require(path.join(__dirname, '../model')).permRole
const service = {
  addPermission: async(function (permUsuario) {
    permUsuario = awaitFor(permUsuarioModel.create(permUsuario))
    return permUsuarioModel
      .findById(permUsuario._id)
      .populate({path: 'user', model: 'User'})
      .populate({path: 'perm', model: 'Perm'})
  }),
  listPermsForUser: async(function (id) {
    return PermUsuarioModel
    .find({user: id})
    .populate({path: 'user', model: 'User'})
    .populate({path: 'perm', model: 'Perm'})
  }),
  listPermsForRole: async(function (id) {
    return PermRoleModel
    .find({'role.code': id})
    .populate('role')
    .populate({path: 'perm', model: 'Perm'})
  }),
  removePermission: async(function (id) {
    return PermUsuarioModel.remove({_id: id})
  })
}
module.exports = service
