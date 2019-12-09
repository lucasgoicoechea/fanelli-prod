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
  const lineCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('lines')
  const userCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('users')
  const lines = awaitFor(lineCollection.find({}).toArray())
  lines.forEach(l => {
    awaitFor(userCollection.update({line: l.value}, {$set: {line: l._id}}, {multi: true}))
  })
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
