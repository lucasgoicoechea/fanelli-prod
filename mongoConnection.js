'use strict'
const mongoose = require('mongoose')
const Bluebird = require('bluebird')

const mongoConnection = {
  connect: function (config) {
    mongoose.Promise = Bluebird
    return mongoose.connect(config.db.uri, {
      useMongoClient: true
    })
  },

  getMongoose: function () {
    return mongoose
  }
}

module.exports = mongoConnection
