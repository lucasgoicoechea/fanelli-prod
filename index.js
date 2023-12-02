'use strict'
require('dotenv').config()
const path = require('path')
const express = require('express')
const config = require(path.join(__dirname, '/config'))
const app = express()
const server = require(path.join(__dirname, '/server'))
const mongoConnection = require(path.join(__dirname, '/mongoConnection'))
const api = require(path.join(__dirname, '/api'))
const winston = require('winston')
const bodyParser = require('body-parser')
const expressJWT = require('express-jwt')
const cors = require('cors')
const idempotencyChecker = require(path.join(__dirname, '/middlewares/idempotencyChecker'))
const mongooseIdempotencyHandler = require(path.join(__dirname, '/libs/idempotencyHandler'))
const validateUser = require(path.join(__dirname, '/middlewares/authentication')).validateUser
const reloadToken = require(path.join(__dirname, '/middlewares/refreshToken')).reloadToken
const notification = require(path.join(__dirname, '/libs/notification'))

winston.log('info', 'CONNECTING TO MONGO: ', {URI: config.db.uri})
mongoConnection.connect(config)
  .then(() => { winston.log('info', 'Mongo connection successful') })
  .catch((e) => { winston.log('info', 'Error connecting: ', {error: e}) })

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))


app.use('/api', expressJWT({secret: config.jwtSecret}).unless({path: ['/api/login']}))

app.use('/api', reloadToken.unless({path: ['/api/login']})) 

app.use('/api', validateUser.unless({path: ['/api/login']}))

app.use('/api', idempotencyChecker(mongooseIdempotencyHandler))

api.init(app)
notification.init()
server.start(config, app)
winston.level = 'info'//config.logLevel
winston.log('info', 'App ready')

module.exports = app
