const path = require('path')
const express = require('express')
const router = express.Router()
const reportController = require(path.join(__dirname, '/../controller')).report
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE
router.get('/user/:id', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), reportController.getReportForCollaborator)
router.get('/day/:day', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), reportController.getReportForDay)
router.get('/all', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), reportController.getReportForAll)
module.exports = router
