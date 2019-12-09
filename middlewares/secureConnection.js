'use strict'

module.exports = function (options) {
  options = options || {}
  let enabled = false

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    enabled = true
  }

  if (options.disabled === true) {
    enabled = false
  }

  return sslMiddleware

  function sslMiddleware (req, res, next) {
    if (!enabled) return next()

    let isSecure = req.secure

    if (!isSecure && options.trustProxy) {
      isSecure = req.headers['x-forwarded-proto'] === 'https'
    }

    if (isSecure) {
      return next()
    } else if (options.disallow) {
      return options.disallow(req, res)
    }
  }
}
