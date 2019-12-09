'use strict'
const path = require('path')
const area = require(path.join(__dirname, '../data/area'))
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
  const shiftCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('areas')
  awaitFor(shiftCollection.insert(area))
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
