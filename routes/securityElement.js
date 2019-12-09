'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const securityElementController = require(path.join(__dirname, '/../controller')).securityElement
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.get('/', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), securityElementController.get)
router.get('/request/:id', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.SECTOR_PANOL, ROLE.RRHH]), securityElementController.getById)
router.get('/pending-resolution', authorize([ROLE.SECTOR_PANOL, ROLE.RRHH]), securityElementController.getPendingResolution)
router.get('/solved', authorize([ROLE.SECTOR_PANOL, ROLE.RRHH]), securityElementController.getSolved)
router.get('/get-pdf/:id', authorize([ROLE.SECTOR_PANOL, ROLE.RRHH]), securityElementController.getPdf)
router.get('/delivered', authorize([ROLE.SECTOR_PANOL, ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), securityElementController.getDelivered)
router.get('/by-me/active', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), securityElementController.getActiveByMe)
router.get('/by-me/history', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), securityElementController.getHistoryByMe)
router.get('/to/:id', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), securityElementController.getDoneTo)
router.get('/active', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), securityElementController.getActive)
router.post('/delivered/:id', authorize([ROLE.SECTOR_PANOL, ROLE.RRHH]), securityElementController.delivered)
router.post('/:id', authorize([ROLE.SUPERVISORES, ROLE.RRHH]), validator.securityElement.request, securityElementController.update)
router.post('/', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.RRHH]), validator.securityElement.request, securityElementController.request)
router.post('/approval/:id', authorize([ROLE.JEFES, ROLE.RRHH]), validator.securityElement.approval, securityElementController.approval)

module.exports = router
