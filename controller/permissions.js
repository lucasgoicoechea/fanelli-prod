const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const permissionsService = require(path.join(__dirname, '../service')).permissions
const controller = {
 
  addPermission: async(function (req, res) {
    permissions = awaitFor(permissionsService.addPermission(permUsuario))
    res.json({success: true, perrmissions})
  }),

  listPermsForUser: async(function (req, res) {
    const perrmissions = awaitFor(permissionsService.listPermsForUser())
    res.json({success: true, perrmissions})
  }),

  listPermsForRole: async(function (req, res) {
    const perrmissions = awaitFor(permissionsService.listPermsForRole(req.query.id))
    res.json({success: true, perrmissions})
  }),

  removePermission: async(function (req, res) {
    awaitFor(permissionsService.removePermission(req.params.id))
    res.json({success: true, message: 'Permiso eliminado'})
  })
}
module.exports = controller
