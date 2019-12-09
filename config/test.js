module.exports = function (config) {
  process.env.TZ = 'America/Argentina/Buenos_Aires'
  config.logLevel = process.env.LOG_LEVEL || 'debug'
  config.jwtSecret = 'secret'
  config.db.port = 27017
  config.db.name = 'fanelliTest'
  config.db.host = 'localhost'
  config.db.uri = process.env.MONGO_TEST_URL || 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name

  config.port = 3003
}
