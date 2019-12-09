'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const staffNewsController = require(path.join(__dirname, '/../controller')).staffNews
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.post('/', validator.staffNews.create, authorize([ROLE.SUPERVISORES, ROLE.ADMINISTRACION, ROLE.JEFES]), staffNewsController.create)
router.post('/exculpatory', validator.staffNews.exculpatory, authorize([ROLE.ADMINISTRACION]), staffNewsController.addExculpatory)

/**
 * @api {put} /api/staff-news/:id Update a staff news observation and exculpatory
 * @apiName updateStaffNews
 * @apiGroup StaffNews
 *
 * @apiUse JWT
 * @apiUse updateStaffNews
 *
 */
router.put('/:id', authorize([ROLE.ADMINISTRACION]), staffNewsController.update)
router.get('/without-exculpatory', staffNewsController.withoutExculpatory)
router.get('/finished', authorize([ROLE.ADMINISTRACION]), staffNewsController.finished)
router.get('/pdf/:id', staffNewsController.getPDF)
router.put('/:id', authorize([ROLE.ADMINISTRACION]), validator.staffNews.create, staffNewsController.update)
router.get('/to/:id', authorize([ROLE.SUPERVISORES, ROLE.JEFES, ROLE.ADMINISTRACION]), staffNewsController.getDoneTo)
module.exports = router
