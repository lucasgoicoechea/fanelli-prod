const path = require('path')
const express = require('express')
const router = express.Router()
const lineController = require(path.join(__dirname, '/../controller')).line
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), lineController.create)

router.get('', authorize([[ROLE.JEFE_PLANTA, ROLE.ADMINISTRACION]]), lineController.list)

router.delete('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), lineController.remove)

router.put('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_PERSONAL]), lineController.edit)

module.exports = router
