'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const checklistController = require(path.join(__dirname, '/../controller')).checklist
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('/', validator.checklist.check, authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), checklistController.add)
router.post('/comment', validator.checklist.comment, authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), checklistController.addCommentToCheck)
router.post('/observation', validator.checklist.observation, authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), checklistController.addObservation)
router.get('/', authorize([ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.get)
router.get('/dates', authorize([ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.datesWithChecklists)
router.get('/id/:id', authorize([ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.getChecklist)
router.get('/revision/:id', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.revision)
router.get('/correction/:id', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.correction)
router.get('/summary', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.summary)
router.get('/current/:sector', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.getCurrent)
router.get('/comparative/:sector', authorize([ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.comparative)
router.get('/:sector/pdf', authorize([ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), validator.checklist.pdf, checklistController.getPdf)
router.get('/:sector', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), checklistController.getChecks)

module.exports = router
