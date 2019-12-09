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
  const areaCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('areas')
  const userCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('users')
  const areas = awaitFor(areaCollection.find({}).toArray())
  const users = awaitFor(userCollection.find({}).toArray())
  for (const u of users) {
    if (u.hasOwnProperty('area')) {
      let userArea = areas.find(a => a.value === u.area)
      awaitFor(userCollection.update({_id: u._id}, {$set: {area: userArea._id}}))
    }
  }
  return true
})

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
