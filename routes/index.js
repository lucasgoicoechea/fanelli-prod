'use strict'
const path = require('path')
/* This file has all the routes in the exported  properties
 * to create a new route you need to create the file and add it here
 * Boilerplate of a route:
 *
 *
 * const path = require('path')
 * const express = require('express')
 * const router = express.Router()
 * const controller = require(path.join(__dirname, '/../controller')).nameController
 * const validator = require(path.join(__dirname, '/../middlewares/validator'))
 * const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
 * const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE
 * router.HTTPVERB('endpoint', authorize([roles]), nameController.method)
 * ...
 * module.exports = router
 */

/**
 * @apiDefine JWT
 * @apiHeader {String} Authorization signed by this api, given in the login
 */

/**
 *
 * @apiDefine pagination
 * @apiParam {Integer} [page] optional page query parameter, if sent the results will be paginated
 * @apiParam {Integer} [per_page] number of results in pagination, default 15
 */

module.exports = {
  authentication: require(path.join(__dirname, '/authentication')),
  catalog: require(path.join(__dirname, '/catalog')),
  securityElement: require(path.join(__dirname, '/securityElement')),
  user: require(path.join(__dirname, '/user')),
  checklist: require(path.join(__dirname, '/checklist')),
  checklistLTres: require(path.join(__dirname, '/checklistLTres')),
  staffNews: require(path.join(__dirname, '/staffNews')),
  staffRequest: require(path.join(__dirname, '/staffRequest')),
  eventsTimeline: require(path.join(__dirname, '/eventsTimeline')),
  dashboard: require(path.join(__dirname, '/dashboard')),
  shift: require(path.join(__dirname, '/shift')),
  availability: require(path.join(__dirname, '/availability')),
  sanction: require(path.join(__dirname, '/sanction')),
  occurrence: require(path.join(__dirname, '/occurrence')),
  announcement: require(path.join(__dirname, '/announcement')),
  meeting: require(path.join(__dirname, '/meeting')),
  area: require(path.join(__dirname, '/area')),
  sector: require(path.join(__dirname, '/sector')),
  position: require(path.join(__dirname, '/position')),
  line: require(path.join(__dirname, '/line')),
  report: require(path.join(__dirname, '/report')),
  supervisionpartLTres: require(path.join(__dirname, '/supervisionPartLTres')),
  supervisionpart: require(path.join(__dirname, '/supervisionPart')),
  bugReport: require(path.join(__dirname, '/bugReport'))
}
