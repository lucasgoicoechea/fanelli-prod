'use strict'
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
let dbm
let type
let seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = async(function (db) {
  const positionCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('positions')
  const userCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('users')
  const positions = awaitFor(positionCollection.find({}).toArray())
  positions.forEach(p => {
    awaitFor(userCollection.update({position: p.value}, {$set: {position: p._id}}, {multi: true}))
  })
  const chofer = 'Chofer Pala  cargadora'
  const choferObject = positions.find(p => p.value === 'Chofer Pala cargadora')
  awaitFor(userCollection.update({position: chofer}, {$set: {position: choferObject._id}}, {multi: true}))
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
