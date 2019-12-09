'use strict'
const path = require('path')
const Boom = require('boom')
const _ = require('lodash')
const USER_TYPE = require(path.join(__dirname, '/../libs/const')).USER_TYPE

/**
 * @param {string[]} [userTypes] that are allowed to use the endpoint
 * @returns {function} Middleware that checks if the user is allowed to use the endpoint
 */
function authorize (userTypes) {
  return function (req, res, next) {
    if (req.user.user_type.toUpperCase() === USER_TYPE.SUPERADMIN) {
      return next()
    }
    userTypes = _.flattenDeep(userTypes)
    if (_.includes(userTypes, req.user.user_type.toUpperCase())) {
      return next()
    }

    return next(Boom.unauthorized('Usuario no autorizado a realizar esta accion'))
  }
}

module.exports = {
  authorize: authorize
}
