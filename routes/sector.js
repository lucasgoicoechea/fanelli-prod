const path = require('path')
const express = require('express')
const router = express.Router()
const sectorController = require(path.join(__dirname, '/../controller')).sector
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), sectorController.create)

router.get('', authorize([ROLE.JEFE_PLANTA, ROLE.ADMINISTRACION]), sectorController.list)

router.delete('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), sectorController.remove)

router.put('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), sectorController.edit)

module.exports = router
