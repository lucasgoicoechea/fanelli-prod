'use strict'
const path = require('path')
const CatalogModel = require(path.join(__dirname, '/../model')).catalog
const constant = require(path.join(__dirname, '../libs/const'))
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError

const controller = {
  add: async(function (req, res) {
    let item = req.body.item
    item.sizes = constant.SIZES[item.type.toUpperCase()]
    item.colours = constant.COLOURS[item.type.toUpperCase()]
    let newItem = awaitFor(CatalogModel.create(req.body.item))
    res.json({success: true, item: newItem})
  }),

  all: async(function (req, res) {
    res.json({success: true, catalog: awaitFor(CatalogModel.find({}))})
  }),

  available: async(function (req, res) {
    res.json({success: true, catalog: awaitFor(CatalogModel.find({available: true}))})
  }),

  update: async(function (req, res, next) {
    let item = req.body.item
    if (awaitFor(CatalogModel.exists(item))) {
      let itemEdited = awaitFor(CatalogModel.findOneAndUpdate({_id: req.params.id}, {$set: item}, {new: true}))
      res.json({success: true, item: itemEdited})
    } else {
      next(new AppError('There isn\'t any item with that id', 'Ese item no existe!'))
    }
  }),

  remove: async(function (req, res) {
    awaitFor(CatalogModel.findOneAndRemove({_id: req.params.id}))
    res.json({success: true, message: 'Item eliminado del catalogo exitosamente!'})
  })

}
module.exports = controller
