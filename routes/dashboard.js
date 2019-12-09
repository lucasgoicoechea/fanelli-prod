const path = require('path')
const express = require('express')
const router = express.Router()
const dashboardController = require(path.join(__dirname, '/../controller')).dashboard
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.get('birthdays', dashboardController.getBirthdays)

module.exports = router
