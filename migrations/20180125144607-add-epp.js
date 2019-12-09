'use strict'
const path = require('path')
const bson = require(path.join(__dirname, '/../libs/bson'))
const fs = require('fs')
const eppBuffer = fs.readFileSync(path.join(__dirname, '/../data/securityelements.bson'))
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

exports.up = function (db) {
  if (process.env.NODE_ENV !== 'production') {
    const eppDeserialize = bson.deserialize(eppBuffer)
    return db.insert('securityelements', eppDeserialize)
  }
}

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
