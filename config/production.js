module.exports = function (config) {
  config.logLevel = process.env.LOG_LEVEL || 'warning'
  config.jwtSecret = process.env.JWT_SECRET
  config.db.uri = process.env.MONGO_URL
  /** @type {int} in milliseconds */
  config.EPP_EDIT_WINDOW = 5 * 1000 * 60
}
