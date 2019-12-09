'use strict'

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
  const usersCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('users')
  const users = awaitFor(db._find('users', {user_type: 'SUPERVISOR'}))
  users.forEach(u => {
    awaitFor(usersCollection.update({_id: u._id}, {$set: {user_type: 'SUPERVISOR_PRODUCCION'}}))
  })
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
