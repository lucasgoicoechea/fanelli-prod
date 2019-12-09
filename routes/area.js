const path = require('path')
const express = require('express')
const router = express.Router()
const areaController = require(path.join(__dirname, '/../controller')).area
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), areaController.create)

router.get('', authorize([[ROLE.JEFE_PLANTA, ROLE.ADMINISTRACION]]), areaController.list)

router.delete('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), areaController.remove)

router.put('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), areaController.edit)

module.exports = router
