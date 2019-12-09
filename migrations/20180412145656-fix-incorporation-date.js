'use strict'

const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const incorporationDates = require(path.join(__dirname, '/../data/incorporation_dates'))

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
  incorporationDates.forEach(ic => {
    const incorporationDate = new Date(ic.incorporation_date)
    incorporationDate.setTime(incorporationDate.getTime() + 1000 * 30 * 30 * 3)
    awaitFor(usersCollection.update({ord: ic.ord}, {$set: {incorporation_date: incorporationDate}}))
  })
  return true
})
exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
