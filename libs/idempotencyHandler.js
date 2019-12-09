const path = require('path')
const Bluebird = require('bluebird')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const idempotencySchema = new Schema({
  idempotencyKey: {
    type: String
  }
})

idempotencySchema.statics.exists = function (key) {
  return this.findOne({
    idempotencyKey: key
  }).then(item => {
    return Bluebird.resolve(item !== null)
  })
}

idempotencySchema.statics.addKey = function (key) {
  return this.create({
    idempotencyKey: key
  })
}

const IdempotencyModel = mongoose.model('Idempotencys', idempotencySchema)

module.exports = IdempotencyModel
