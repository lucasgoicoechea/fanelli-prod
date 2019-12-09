'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const authenticationController = require(path.join(__dirname, '/../controller')).authentication

const validator = require(path.join(__dirname, '/../middlewares/validator'))

router.post('/login', validator.auth.login, authenticationController.login)
router.post('/subscribe', validator.auth.subscribe, authenticationController.subscribe)

module.exports = router
