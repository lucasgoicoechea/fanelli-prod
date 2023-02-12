const path = require('path')
const express = require('express')
const router = express.Router()
const permissionController = require(path.join(__dirname, '/../controller')).permissions
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), permissionController.addPermission)

router.get('/listPermsForUser', authorize([[ROLE.JEFE_PLANTA, ROLE.ADMINISTRACION]]), permissionController.listPermsForUser)

router.get('/listPermsForRole', authorize([[ROLE.JEFE_PLANTA, ROLE.ADMINISTRACION]]), permissionController.listPermsForRole)

router.delete('/removePermUser/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), permissionController.removePermission)

module.exports = router