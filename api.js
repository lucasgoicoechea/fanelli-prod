'use strict'
const path = require('path')
const routes = require(path.join(__dirname, '/routes'))
const winston = require('winston')
const express = require('express')

/*
Api creada por the beast Lucas Botteri (me vas a putear bastante)
                  ,#####,
                  #_   _#
                  |e` `e|
                  |  u  |
                  \  =  /
                  |\___/|
         ___ ____/:     :\____ ___
       .'   `.-===-\   /-===-.`   '.
      /      .-"""""-.-"""""-.      \
     /'             =:=             '\
   .'  ' .:    o   -=:=-   o    :. '  `.
   (.'   /'. '-.....-'-.....-' .'\   '.)
   /' ._/   ".     --:--     ."   \_. '\
  |  .'|      ".  ---:---  ."      |'.  |
  |  : |       |  ---:---  |       | :  |
   \ : |       |_____._____|       | : /
   /   (       |----|------|       )   \
  /... .|      |    |      |      |. ...\
 |::::/'' jgs /     |       \     ''\::::|
 '""""       /'    .L_      `\       """"'
            /'-.,__/` `\__..-'\
           ;      /     \      ;
           :     /       \     |
           |    /         \.   |
           |`../           |  ,/
           ( _ )           |  _)
           |   |           |   |
           |___|           \___|
           :===|            |==|
            \  /            |__|
            /\/\           /"""`8.__
            |oo|           \__.//___)
            |==|
            \__/
 */

const Router = {
  init: function (app) {
    app.use('/api', routes.authentication)
    app.use('/api/catalog', routes.catalog)
    app.use('/api/security-element', routes.securityElement)
    app.use('/api/user', routes.user)
    app.use('/api/checklist', routes.checklist)
    app.use('/api/checklistLTres', routes.checklistLTres)
    app.use('/api/staff-news', routes.staffNews)
    app.use('/api/staff-request', routes.staffRequest)
    app.use('/api/events-timeline', routes.eventsTimeline)
    app.use('/api/dashboard', routes.dashboard)
    app.use('/api/shift', routes.shift)
    app.use('/api/area', routes.area)
    app.use('/api/availability', routes.availability)
    app.use('/api/sanction', routes.sanction)
    app.use('/api/occurrence', routes.occurrence)
    app.use('/api/report', routes.report)
    app.use('/api/announcement', routes.announcement)
    app.use('/api/meeting', routes.meeting)
    app.use('/api/position', routes.position)
    app.use('/api/sector', routes.sector)
    app.use('/api/line', routes.line)
    app.use('/api/supervisionpart', routes.supervisionpart)
    app.use('/api/supervisionpartLTres', routes.supervisionpartLTres)
    app.use('/api/bugReport', routes.bugReport)
    app.use('/api/permissions', routes.permissions)
    app.use('/doc', express.static('apidoc'))
    errorHandler(app)
  }
}

function errorHandler (app) {
  app.use(function (err, req, res, next) {
    if (typeof err.isBoom !== 'undefined' && err.isBoom === true) {
      err.output.payload.success = false
      res.status(200).json({success: false, error: err.output.payload})
    } else if (typeof err.isApp !== 'undefined' && err.isApp === true) {
      res.json(err.getPayload())
    } else if (err.name === 'UnauthorizedError') {
      res.status(401).json({
        success: false,
        error: err.name,
        message: 'Token invalido o mal formado - RE001',
        status: err.status
      })
    } else {
      winston.log('error', 'unhandled error', {error: err.toString()})
      winston.log('info', 'unhandled error ', {error: err.toString()})
      res.status(500).send('Something broke!')
    }
  })
}

module.exports = Router
