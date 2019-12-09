const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const requests = new Map()
const Const = require(path.join(__dirname, '/../libs/const'))

/**
 * @function Creates the middleware with a handler
 * @param {Object} handler - The handler responsible for the Idempotency-Key.
 * @param {function} handler.exists()
 * @param {function} handler.addKey()
 * @return {function} the middleware
 */
module.exports = function (handler) {
  return async(function (req, res, next) {
    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      if (requests.has(idempotencyKey)) {
        return next(new AppError('Idempotency-Key already sent', 'Solicitud repetida', Const.ERROR.IDEMPOTENCY_KEY_DUPLICATE))
      }
      requests.set(idempotencyKey, '0')
      const exists = awaitFor(handler.exists(idempotencyKey))
      if (exists) {
        requests.delete(idempotencyKey)
        return next(new AppError('Idempotency-Key already sent', 'Solicitud repetida', Const.ERROR.IDEMPOTENCY_KEY_DUPLICATE))
      } else {
        awaitFor(handler.addKey(idempotencyKey))
        requests.delete(idempotencyKey)
        return next()
      }
    }
    return next()
  })
}
