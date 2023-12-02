module.exports = function (config) {
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === null) process.env.NODE_ENV = 'localhost'
  config.logLevel = process.env.LOG_LEVEL || 'silly'
  config.jwtSecret = 'secret'
  config.db.port = 27017
  config.db.name = 'fanelli'
  config.db.host = 'localhost'
  config.db.uri = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name
  // In development we send notifications 1 second after because we are very anxious
  config.EPP_EDIT_WINDOW = 1 * 1000 * 1

  config.CHECKLIST_REMINDER = 30 * 60 * 1000
}
