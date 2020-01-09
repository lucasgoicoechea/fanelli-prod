const path = require('path')
const userModel = require(path.join(__dirname, '/../model')).user
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const Boom = require('boom')
const ObjectId = require('mongoose').Types.ObjectId
const unless = require('express-unless')

let validateUser = async(function (req, res, next) {
  if (!ObjectId.isValid(req.user.id)) {
    next(Boom.unauthorized('Token invalido o mal formado - RE002'))
    return
  }
  let user = awaitFor(userModel.findOne({_id: req.user.id, 'auth.username': {$exists: true}, 'auth.password': {$exists: true}}, {user_type: 1}))
  if (user !== null) {
    req.user.user_type = user.user_type
    next()
  } else {
    next(Boom.unauthorized('Token invalido o mal formado - RE003'))
  }
})

validateUser.unless = unless

module.exports = {
  validateUser: validateUser
}
