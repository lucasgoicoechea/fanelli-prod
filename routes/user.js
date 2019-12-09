'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()
const userController = require(path.join(__dirname, '/../controller')).user
const authorize = require(path.join(__dirname, '/../middlewares/authorization')).authorize
const ROLE = require(path.join(__dirname, '/../libs/const')).ROLE
const validator = require(path.join(__dirname, '/../middlewares/validator'))
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage: storage, limits: {fileSize: 10000000}})

// Removed this unused 2 routes because of the shift population the controllers need to be changed, but there are not used and would require precious time to change it
// router.get('/current', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_PLANTA, ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_LINEA]), userController.currentShift)
// router.get('/search', authorize([ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_PLANTA, ROLE.SUPERVISOR_PRODUCCION, ROLE.JEFE_LINEA]), userController.searchEmployees)
router.get('/me', userController.me)
router.get('/all', userController.all)
router.get('/with-credentials', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_LINEA, ROLE.JEFE_PLANTA]), userController.getWithCredentials)
router.get('/:id', authorize([ROLE.JEFES, ROLE.ADMINISTRACION, ROLE.SUPERVISORES]), userController.getById)
router.get('/me/notifications', userController.notifications)
router.get('/', userController.get)
router.post('/notification-seen', validator.user.notificationSeen, userController.notificationSeen)
router.post('/remove-notification', validator.user.notificationSeen, userController.removeNotification)
router.post('/clear-notifications', userController.clearNotifications)
router.post('/', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), upload.single('picture'), userController.create)
router.post('/picture/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), upload.single('picture'), userController.uploadPicture)
router.put('/:id/credentials', authorize([ROLE.RRHH, ROLE.JEFE_PLANTA]), validator.user.editCredentials, userController.editCredentials)
router.post('/:id/revoke', authorize([ROLE.RRHH, ROLE.JEFE_PLANTA]), userController.revokeCredentials)
router.put('/:id', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), userController.update)

/**
 * @api {post} user/:id/deactivate Deactivate an user with a description
 * @apiName deactivateUser
 * @apiGroup User
 *
 * @apiUse JWT
 *
 * @apiParam {string} :id user id
 * @apiParam {string} deactivatedReason reason
 *
 */

router.post('/:id/deactivate', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), validator.user.deactivateUser, userController.deactivate)

/**
 * @api {post} user/:id/activate Reactivate an user
 * @apiName ActivateUser
 * @apiGroup User
 *
 * @apiUse JWT
 *
 * @apiParam {string} :id user id
 *
 */
router.post('/:id/activate', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), userController.activate)

router.get('/exists/legajo/:legajo', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), userController.legajoExists)
router.get('/exists/dni/:dni', authorize([ROLE.ADMINISTRACION, ROLE.JEFE_PLANTA]), userController.dniExists)
router.put('/:id/responsible-of', authorize([ROLE.RRHH]), userController.updateResponsibleOf)
router.get('/:id/responsible-of', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.ADMINISTRACION]), userController.responsibleOf)
router.get('/:id/bosses', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.ADMINISTRACION]), userController.bossesOf)
router.get('/:id/indirect-team', authorize([ROLE.JEFES, ROLE.SUPERVISORES, ROLE.ADMINISTRACION]), userController.indirectTeamOf)
router.get('/team/strict', userController.strictTeam)

module.exports = router
