const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const PermRoleChecked = require('../model/permRoleChecked')
const PermUsuarioModel = require(path.join(__dirname, '../model')).permUsuario
const PermRoleModel = require(path.join(__dirname, '../model')).permRole
const RoleModel = require(path.join(__dirname, '../model')).role
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
    const role = awaitFor(RoleModel.findOne({'code': id}));
    const permsRole = awaitFor(PermRoleModel
      .find({'role': role._id})
      .populate('role')
      .populate({path: 'perm', model: 'Perm'})
      .then( (permroled) => {
        let permCheckd = [];
        let permrolecheck = PermRoleChecked;
        if (permroled !== undefined) {
          permroled.forEach(element => {
            permrolecheck._id = element._id;
            permrolecheck.perm._id = element.perm._id;
            permrolecheck.perm.description = element.perm.description; 
            permrolecheck.perm.code = element.perm.code; 
            permCheckd.push(permrolecheck);
           });
        }        
        return permCheckd;
      }));
    if (permsRole.lenght > 0 ) {
      const permssUser =  awaitFor(PermUsuarioModel.find({user: idUser})
      .populate({path: 'user', model: 'User'})
      .populate({path: 'perm', model: 'Perm'})
      .then( (permuser) => {
        return permuser;
      })
      );
      if (permssUser) {
        permsRole.forEach( pR => {
            pR.checked = permssUser.filter(t => t.perm._id == pR.perm._id).lenght > 0
        })
      }
    }
    
    return permsRole;
  }),
  removePermission: async(function (id) {
    return PermUsuarioModel.remove({_id: id})
  })
}
module.exports = service
