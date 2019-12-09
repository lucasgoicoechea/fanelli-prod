const path = require('path')
const express = require('express')
const router = express.Router()
const positionController = require(path.join(__dirname, '/../controller')).position
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), positionController.create)

router.get('', authorize([ROLE.JEFE_PLANTA, ROLE.ADMINISTRACION, ROLE.JEFE_PERSONAL]), positionController.list)

router.delete('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), positionController.remove)

router.put('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), positionController.edit)

module.exports = router
