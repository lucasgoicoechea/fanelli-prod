const http = require('http')
const winston = require('winston')

const server = {
  start: function (config, app) {
    http.createServer(app).listen(config.port, function () {
      winston.log('info', 'listening on port ' + config.port)
    })
  }
}

module.exports = server
