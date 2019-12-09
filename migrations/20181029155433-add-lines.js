'use strict'
const path = require('path')
const lines = require(path.join(__dirname, '../data/line'))
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
var dbm
var type
var seed

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
  const shiftCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('lines')
  awaitFor(shiftCollection.insert(lines))
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
