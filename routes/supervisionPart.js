'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const supervisionpartController = require(path.join(__dirname, '/../controller')).supervisionPart
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('/', validator.supervisionPart.hour, authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.add)
router.post('/createObservationHour', validator.supervisionPart.observation, authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.addComment)
router.post('/createStopping',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.addStopping)
router.post('/createMaterial',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.addMaterial)
router.post('/createRepositionPallet',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.addRepositionPallet)
router.post('/delRepositionPallet',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.removeRepositionPallet)
router.post('/addVagon',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.addVagon)
router.post('/delStopping',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.removeStopping)
router.post('/delMaterial',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.removeMaterial)
router.post('/delVagon',  authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.removeVagon)
router.post('/observation', validator.supervisionPart.observation, authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.addObservation)
router.post('/totals', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.updateTotals)
router.post('/updateHour', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA]), supervisionpartController.updateHour)
router.get('/', authorize([ROLE.JEFE_LINEA, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.get)
router.get('/dates', authorize([ROLE.JEFE_LINEA, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.datesWithSupervisionpart)
router.get('/id/:id', authorize([ROLE.JEFE_LINEA,  ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.getSupervisionpart)
//router.get('/revision/:id', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.revision)
//router.get('/correction/:id', authorize([ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.correction)
router.get('/summary', authorize([ROLE.JEFE_PLANTA, ROLE.OFICIALES, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.summary)
router.get('/current/:sector', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.getCurrent)
router.get('/comparative/:sector', authorize([ROLE.JEFE_LINEA, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.comparative)
//router.get('/:sector/pdf', authorize([ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), validator.checklist.pdf, supervisionpartController.getPdf)
router.get('/:sector', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.OFICIALES, ROLE.JEFE_PLANTA, ROLE.JEFE_LINEA, ROLE.RRHH, ROLE.JEFE_MANTENIMIENTO]), supervisionpartController.getSupervisionparts)
router.get('/fails/:sector',  supervisionpartController.getFails)

module.exports = router
