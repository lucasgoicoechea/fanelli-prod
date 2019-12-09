'use strict'
const path = require('path')
const bson = require(path.join(__dirname, '/../libs/bson'))
const fs = require('fs')
const catalogBuffer = fs.readFileSync(path.join(__dirname, '/../data/catalogs.bson'))
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
    const catalogDeserialize = bson.deserialize(catalogBuffer)
    return db.insert('catalogs', catalogDeserialize)
  }
}

exports.down = function (db) {
  return null
}

exports._meta = {
  'version': 1
}
