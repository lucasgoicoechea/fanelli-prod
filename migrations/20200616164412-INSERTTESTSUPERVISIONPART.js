'use strict'
const path = require('path')
const fails = require(path.join(__dirname, '../data/fails'))
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
  // db-migrate doesn't have an update method so we need to get the node mongo driver this way
  const failCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('supervisionparts')
  awaitFor(failCollection.insert(fails))
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
