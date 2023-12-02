'use strict'
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const winston = require('winston')
const UserModel = require(path.join(__dirname, '/../model')).user
const userService = require(path.join(__dirname, '/../service')).user
const getShift = require(path.join(__dirname, '/../libs/shift')).getShift
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const s3 = require(path.join(__dirname, '/../libs/s3'))
const _ = require('lodash')
const Boom = require('boom')
const PermRoleChecked = require('../model/permRoleChecked')
const constants = require(path.join(__dirname, '../libs/const'))

const controller = {
  create: async(function (req, res, next) {
    //  TODO user validations ?
    if (!awaitFor(UserModel.exist(req.body))) {
      let newUser = awaitFor(UserModel.create(req.body))
      if (req.file !== undefined) {
        const key = Math.floor(Math.random() * 1000000)
        awaitFor(s3.saveProfilePicture(req.file.buffer, key))
        newUser.set({s3Key: key})
        newUser = awaitFor(newUser.save())
      }
      res.json({success: true, message: 'Usuario creado exitosamente!', user: newUser})
    } else {
      next(new AppError('The user already exists', 'Ya existe un usuario con ese dni / legajo'))
    }
  }),
  update: async(function (req, res, next) {
    if (awaitFor(UserModel.findById(req.params.id)) === null) {
      next(new AppError('The user does not exists', 'No existe un usuario con ese id'))
    }
    // don't allow edit of auth (username and password)
    const unset = {}
    if (req.body.user.auth) {
      delete req.body.user.auth
    }
    if (!req.body.user.line) {
      unset.line = 1
      delete req.body.user.line
    }
    if (!req.body.user.sector) {
      unset.sector = 1
      delete req.body.user.sector
    }
    if (!req.body.user.area) {
      unset.area = 1
      delete req.body.user.area
    }
    if (!req.body.user.position) {
      unset.position = 1
      delete req.body.user.position
    }
    if (!req.body.user.shift) {
      unset.shift = 1
      delete req.body.user.shift
    }
    if (unset !== {}) {
      awaitFor(UserModel.update({_id: req.params.id}, {$unset: unset}))
    }
    awaitFor(UserModel.update({_id: req.params.id}, {$set: req.body.user}))
    const user = awaitFor(UserModel
      .findById(req.params.id, {auth: 0})
      .populate('shift')
    )
    res.json({success: true, user: user})
  }),
  editCredentials: async(function (req, res, next) {
    let user = awaitFor(UserModel.findById(req.params.id))
    if (req.body.username) {
      if (req.body.username !== '') {
        if (awaitFor(UserModel.usernameIsTaken(req.body.username))) {
          if (user.auth === undefined || user.auth.username === undefined || user.auth.username !== req.body.username) {
            next(new AppError('The username already exists', 'Ya existe ese nombre de usuario'))
            return
          }
        }
        user.set({'auth.username': req.body.username.toLowerCase()})
      } else {
        next(new AppError('Se debe indicar un nombre de usuario', 'Se debe indicar un nombre de usuario'))
        return
      }
    }
    if (req.body.password) {
      if (req.body.password !== '') {
        awaitFor(user.setPassword(req.body.password))
      } else {
        next(new AppError('Se debe indicar una contraseña', 'Se debe indicar una contraseña'))
        return
      }
    }

    if (req.body.user_type) {
      if (_.values(constants.USER_TYPE).includes(req.body.user_type)) {
        user.set({'user_type': req.body.user_type})
      } else {
        return next(new AppError('user type non-existent', 'Tipo de usuario inexistente'))
      }
    }
    let perms = req.body.perms
    if(perms && perms !== undefined ){
      perms.forEach(perm => {
        if(perm.checked){
          let permUser = new PermUsuarioModel()
          permUser.user = perm.user
          permUser.perm = perm.perm
          PermUsuarioModel.save(permUser)
        }
      });
    }
    user = awaitFor(user.save())
    res.json({success: true, message: 'Credenciales modificadas exitosamente', user: user})
  }),
  revokeCredentials: async(function (req, res, next) {
    const user = awaitFor(UserModel.findOneAndUpdate({_id: req.params.id}, {$unset: {auth: ''}}, {new: true}))
    res.json({success: true, message: 'Usuario revocado exitosamente', user: user})
  }),
  getWithCredentials: async(function (req, res, next) {
    const users = awaitFor(UserModel.find({'auth.username': {$exists: true}}))
    res.send({success: true, users: users})
  }),
  currentShift: async(function (req, res) {
    let name = req.query.q
    let currentShift = getShift()
    let currentWorkersShift
    // winston.log('debug', 'current shift', {'shift': currentShift})
    if (name !== undefined) {
      currentWorkersShift = awaitFor(UserModel.find({
        shift: currentShift,
        $or: [
          {name: new RegExp('.*' + name + '.*', 'i')},
          {lastname: new RegExp('.*' + name + '.*', 'i')}
        ]
      }, {auth: 0})
        .limit(10))
    }
    res.json({success: true, employees: currentWorkersShift})
  }),
  searchEmployees: async(function (req, res) {
    let name = req.query.q
    let currentShift = getShift()
    // winston.log('debug', 'current shift', {'shift': currentShift})
    let employees = awaitFor(UserModel.find({
      $or: [
        {name: new RegExp('.*' + name + '.*', 'i')},
        {lastname: new RegExp('.*' + name + '.*', 'i')}
      ]
    })
      .select({
        name: true,
        lastname: true,
        legajo: true,
        sector: true,
        s3Key: true,
        picture: true,
        shift: true
      })
      .limit(10))
    res.json(
      {
        success: true,
        employees: employees.map(e => e.toObject({virtuals: true}))
      })
  }),
  get: async(function (req, res) {
    let employees
    if (!canViewAll(req.user)) {
      employees = awaitFor(userService.teamOf(req.user.id))
    } else {
      employees = awaitFor(userService.all(req.user.id))
    }
    res.json({success: true, employees})
  }),
  strictTeam: async(function (req, res) {
    const collaborators = awaitFor(userService.teamOf(req.user.id))
    res.json({success: true, collaborators})
  }),
  notifications: async(function (req, res) {
    let page = req.query.page || 1
    let perPage = req.query.per_page || 15
    let offset = (page - 1) * perPage
    let notifications = awaitFor(UserModel.findOne({_id: req.user.id}, {notifications: 1})).notifications
    let notificationsSeen = _.filter(notifications, notification => !notification.seen).length
    notifications = _.orderBy(notifications, ['seen', 'date'], ['asc', 'desc']).slice(offset, offset + perPage)
    res.send({success: true, notifications: notifications, notifications_ns_count: notificationsSeen})
  }),
  notificationSeen: async(function (req, res) {
    awaitFor(UserModel.update({
      _id: req.user.id,
      'notifications._id': req.body.notification_id
    }, {$set: {'notifications.$.seen': true}}))
    res.send({success: true})
  }),
  removeNotification: async(function (req, res) {
    awaitFor(UserModel.removeNotification(req.user.id, req.body.notification_id))
    res.send({success: true})
  }),
  me: async(function (req, res) {
    let me = awaitFor(UserModel
      .findById(req.user.id, {auth: 0})
      .populate('shift'))
    res.json({success: true, user: me})
  }),
  getById: async(function (req, res) {
    let user = awaitFor(UserModel
      .findById(req.params.id)
      .populate('shift')
    )
    res.send({success: true, user: user})
  }),
  uploadPicture: async(function (req, res, next) {
    try {
      const user = awaitFor(UserModel.findById(req.params.id))
      if (user === null) next(Boom.notFound('Usuario inexistente'))
      const key = Math.floor(Math.random() * 1000000)
      if (user.picture !== null) {
        awaitFor(s3.delete(user.picture))
      }
      awaitFor(s3.saveProfilePicture(req.file.buffer, key))
      user.set({s3Key: key})
      awaitFor(user.save())
      res.send({success: true, picture: user.picture})
    } catch (error) {
      // winston.log('debug', 'Error sending image to s3', {error: error})
      next(new AppError('Something went wrong', 'Hubo un error al intentar guardar la foto', 500))
    }
  }),
  deactivate: async(function (req, res, next) {
    let user = awaitFor(UserModel.findById(req.params.id))
    user.set({deactivated: true, deactivatedReason: req.body.deactivatedReason})
    user = awaitFor(user.save())
    res.json({success: true, message: 'Usuario desactivado', user: user})
  }),
  activate: async(function (req, res, next) {
    let user = awaitFor(UserModel.findById(req.params.id))
    user.set({deactivated: false})
    user = awaitFor(user.save())
    res.json({success: true, message: 'Usuario re activado', user: user})
  }),
  legajoExists: async(function (req, res, next) {
    const user = awaitFor(UserModel.findOne({legajo: req.params.legajo}))
    res.json({success: true, exists: (user !== null)})
  }),
  dniExists: async(function (req, res, next) {
    const user = awaitFor(UserModel.findOne({dni: req.params.dni}))
    res.json({success: true, exists: (user !== null)})
  }),
  clearNotifications: async(function (req, res, next) {
    awaitFor(UserModel.findByIdAndUpdate(req.user.id, {notifications: []}))
    res.json({success: true, message: 'Notificaciones Borradas'})
  }),
  updateResponsibleOf: async(function (req, res, next) {
    if (!awaitFor(userService.canBeResponsibleOf(req.params.id, req.body.collaborators))) {
      let intersection = awaitFor(userService.getIntersectionResponsible(req.params.id, req.body.collaborators))
      intersection = intersection.map(c => c.lastname).join(', ')
      next(new AppError('Not allow to add this responsible', `No se pueden añadir a ${intersection} ya que posee un cargo superior`, constants.ERROR.CYCLIC_RESPONSIBLE))
    }
    awaitFor(UserModel.update({_id: req.params.id}, {$set: {responsibleOf: req.body.collaborators}}))
    const user = awaitFor(UserModel.findById(req.params.id, {responsibleOf: 1}))
    res.json({success: true, responsibleOf: user.responsibleOf})
  }),
  responsibleOf: async(function (req, res, next) {
    const user = awaitFor(UserModel.findById(req.params.id, {responsibleOf: 1}))
    res.json({success: true, responsibleOf: user.responsibleOf})
  }),
  bossesOf: async(function (req, res, next) {
    const bosses = awaitFor(userService.bossesOf(req.params.id))
    res.json({success: true, bosses})
  }),
  indirectTeamOf: async(function (req, res, next) {
    const responsibleOf = awaitFor(userService.indirectTeamOf(req.params.id))
    res.json({success: true, responsibleOf})
  }),
  all: async(function (req, res, next) {
    let collaborators
    if ([constants.USER_TYPE.JEFE_PLANTA, constants.USER_TYPE.RRHH, constants.USER_TYPE.PERSONAL, constants.USER_TYPE.JEFE_PERSONAL].includes(req.user.user_type)) {
      collaborators = awaitFor(userService.allWithDeactivated())
    } else {
      collaborators = awaitFor(userService.all())
    }
    res.json({success: true, collaborators})
  })
}

function canViewAll (user) {
  return [constants.USER_TYPE.JEFE_LINEA, constants.USER_TYPE.SUPERVISOR_PRODUCCION, constants.USER_TYPE.PERSONAL, constants.USER_TYPE.RRHH, constants.USER_TYPE.HIGIENE_SEGURIDAD, constants.USER_TYPE.JEFE_PERSONAL].includes(user.user_type)
}

module.exports = controller
