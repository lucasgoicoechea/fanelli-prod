const path = require('path')
const express = require('express')
const router = express.Router()
const shiftController = require(path.join(__dirname, '/../controller')).shift
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_PERSONAL, ROLE.RRHH]), shiftController.create)

router.get('', shiftController.list)

router.delete('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_PERSONAL, ROLE.RRHH]), shiftController.remove)

router.put('/:id', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_PERSONAL, ROLE.RRHH]), shiftController.edit)

module.exports = router
