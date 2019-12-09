module.exports = function (config) {
  config.logLevel = 'debug'
  config.jwtSecret = process.env.JWT_SECRET
  config.db.uri = process.env.MONGO_URL
}
