'use strict'
const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const Bluebird = require('bluebird')
const CatalogSchema = new Schema({
  type: {
    type: String,
    required: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  colours: [String],
  model: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  certified: {
    type: Boolean,
    required: true
  },
  sizes: [String],
  available: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['VESTIMENTA', 'SEGURIDAD'],
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
CatalogSchema.statics.exists = function (item) {
  return this.findOne({
    id: item._id
  })
    .then(item => Bluebird.resolve(item !== null))
}

const CatalogModel = mongoose.model('Catalog', CatalogSchema)
module.exports = CatalogModel
