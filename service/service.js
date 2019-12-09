const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')

function Service (db) {
  this.db = db
}

Service.prototype.list = async(function (options = {}) {
  let listCursor = this.db.find({})
  listCursor = this.sort(listCursor, options.sorting)
  listCursor = this.paginate(listCursor, options.pagination)
  return this.simplePopulate(listCursor)
})

Service.prototype.create = async(function (object) {
  object = awaitFor(this.db.create(object))
  const cursor = awaitFor(this.db.findById(object._id))
  return this.simplePopulate(cursor)
})

Service.prototype.edit = async(function (id, editedObject) {
  const object = awaitFor(this.db.update({_id: id}, {$set: editedObject}))
  const cursor = this.db.findById(id)
  return this.simplePopulate(cursor)
})

Service.prototype.remove = async(function (id) {
  awaitFor(this.db.remove({_id: id}))
  return true
})

Service.prototype.get = async(function (id) {
  const cursor = awaitFor(this.db.findById(id))
  return this.detailedPopulate(cursor)
})

Service.prototype.paginate = function (cursor, pagination = {}) {
  if (pagination.page === undefined) {
    return cursor
  }
  pagination.perPage = pagination.perPage || 15
  return cursor
    .skip(pagination.perPage * (pagination.page - 1))
    .limit(pagination.perPage)
}
Service.prototype.sort = function (cursor, sort = {created_at: -1}) {
  return cursor.sort(sort)
}

Service.prototype.simplePopulate = function (cursor) {
  return cursor
}

Service.prototype.detailedPopulate = function (cursor) {
  return cursor
}

module.exports = Service
