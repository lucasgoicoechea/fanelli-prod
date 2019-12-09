'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const staffRequestController = require(path.join(__dirname, '/../controller')).staffRequest
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits: {fileSize: 10000000}})

/**
 * @api {post} /api/staff-requests/license Create a License
 * @apiName CreateLicense
 * @apiGroup License
 *
 * @apiUse JWT
 * @apiUse createLicense
 *
 */
router.post('/license', authorize([ROLE.ADMINISTRACION]), upload.single('file'), validator.staffRequest.license.create, staffRequestController.createLicense)

/**
 * @api {put} /api/staff-request/license/:id Update a staff request observation and dates
 * @apiName updateStaffRequest
 * @apiGroup StaffRequest
 *
 * @apiUse JWT
 * @apiUse updateStaffRequest
 *
 */
router.put('/license/:id', authorize([ROLE.ADMINISTRACION]), staffRequestController.updateLicense)

router.post('/extra-hours', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.ADMINISTRACION]), validator.staffRequest.extraHours.create, staffRequestController.createExtraHours)
router.post('/shift-change', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.ADMINISTRACION]), validator.staffRequest.shiftChange.create, staffRequestController.createShiftChange)
router.post('/leave', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.ADMINISTRACION]), validator.staffRequest.leave.create, staffRequestController.createLeave)

router.post('/extra-hours/approval/:id', authorize([ROLE.JEFES, ROLE.RRHH, ROLE.JEFE_PERSONAL]), staffRequestController.extraHoursApproval)
router.post('/shift-change/approval/:id', authorize([ROLE.JEFES, ROLE.RRHH, ROLE.JEFE_PERSONAL]), staffRequestController.shiftChangeApproval)
router.post('/leave/approval/:id', authorize([ROLE.JEFES, ROLE.RRHH, ROLE.JEFE_PERSONAL]), staffRequestController.leaveApproval)

router.get('/', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES, ROLE.ADMINISTRACION]), staffRequestController.get)

router.get('/resolved', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), staffRequestController.getResolved)
router.get('/pending', authorize([ROLE.JEFES, ROLE.ADMINISTRACION]), staffRequestController.getPending)

router.get('/by-me/pending', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getPending)
router.get('/by-me/resolved', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getResolved)

router.get('/to/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFES, ROLE.SUPERVISORES]), staffRequestController.getDoneTo)

router.post('/extra-hours/archive/:id', authorize([ROLE.ADMINISTRACION]), staffRequestController.archiveExtraHours)
router.post('/shift-change/archive/:id', authorize([ROLE.ADMINISTRACION]), staffRequestController.archiveShiftChange)
router.post('/leave/archive/:id', authorize([ROLE.ADMINISTRACION]), staffRequestController.archiveLeave)

router.get('/not-archived', authorize([ROLE.ADMINISTRACION]), staffRequestController.getNotArchived)

router.get('/extra-hours/pdf/:id', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getExtraHoursPdf)
router.get('/shift-change/pdf/:id', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getShiftChangePdf)
router.get('/leave/pdf/:id', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getLeavePdf)

router.get('/extra-hours/:id', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getExtraHoursById)
router.get('/shift-change/:id', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getShiftChangeById)
router.get('/leave/:id', authorize([ROLE.ADMINISTRACION, ROLE.SUPERVISORES, ROLE.JEFES]), staffRequestController.getLeaveById)

router.post('/extra-hours/cancel/:id', authorize([ROLE.JEFES, ROLE.RRHH, ROLE.JEFE_PERSONAL]), staffRequestController.cancelExtraHours)
router.post('/shift-change/cancel/:id', authorize([ROLE.JEFES, ROLE.RRHH, ROLE.JEFE_PERSONAL]), staffRequestController.cancelShiftChange)
router.post('/leave/cancel/:id', authorize([ROLE.JEFES, ROLE.RRHH, ROLE.JEFE_PERSONAL]), staffRequestController.cancelLeave)

module.exports = router
