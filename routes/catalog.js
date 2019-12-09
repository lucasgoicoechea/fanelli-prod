'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const catalogController = require(path.join(__dirname, '/../controller')).catalog
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE

router.get('/', authorize([ROLE.SECTOR_PANOL]), catalogController.all)
router.get('/available', catalogController.available)
router.post('/', authorize([ROLE.SECTOR_PANOL]), validator.catalog.add, catalogController.add)
router.put('/:id', authorize([ROLE.SECTOR_PANOL]), catalogController.update)
router.delete('/:id', authorize([ROLE.SECTOR_PANOL]), catalogController.remove)

module.exports = router
