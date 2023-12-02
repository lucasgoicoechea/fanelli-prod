'use strict'
const path = require('path')
const UserModel = require(path.join(__dirname, '/../model')).user
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const jwt = require('jsonwebtoken')
const config = require(path.join(__dirname, '/../config'))
const winston = require('winston')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError

const controller = {
  login: async(function (req, res, next) {
    let user = awaitFor(UserModel
      .findOne({'auth.username': req.body.username.toLowerCase()})
      .populate('shift')
    )
    if (user !== null && awaitFor(user.comparePassword(req.body.password))) {
      // winston.log('debug', 'New login from', {user: req.body.username})
      let token = jwt.sign({
        user_type: user.user_type,
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        picture: user.picture
      }, config.jwtSecret,{ expiresIn: '485m', })
      let userResponse = {
        _id: user._id,
        dni: user.dni,
        legajo: user.legajo,
        name: user.name,
        lastname: user.lastname,
        sector: user.sector,
        shift: user.shift,
        lgoico: 24,
        incorporation_date: user.incorporation_date,
        birthdate: user.birthdate,
        position: user.position,
        picture: user.picture,
        user_type: user.user_type
      }
      res.json({success: true, user: userResponse, token: token})
    } else {
      // winston.log('debug', 'Incorrect login from ', {username: req.body.username, password: req.body.password})
      next(new AppError('Invalid credentials', 'Nombre de usuario o contraseña incorrectos'))
    }
  }),

  subscribe: async(function (req, res) {
    let id = awaitFor(UserModel.addSubscription(req.user.id, req.body.subscription))
    res.json({success: true, message: 'Dispositivo suscripto', subscription_id: id})
  })
}

module.exports = controller
