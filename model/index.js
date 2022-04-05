'use strict'
const path = require('path')
/* This file has all the models in the exported properties
 * to create a new model you need to create the file and  add it here
 * Boilerplate of a model:
 *
 *
 * const path = require('path')
 * const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
 * const Schema = mongoose.Schema
 * const name_schema = new Schema({
 *  property1: {
 *    type: type
 *  },
 *  ...
 * }, {
 * timestamps: {
 *  createdAt: 'created_at',
 *  updatedAt: 'updated_at'
 * }
 * })
 * const name_model = mongoose.model('NameModel', name_schema)
 * virtuals, statics, function, etc
 * name_model.CONST1 = CONST1
 * module.exports = name_model
 */
module.exports = {
  user: require(path.join(__dirname, '/user')),
  catalog: require(path.join(__dirname, '/catalog')),
  securityElement: require(path.join(__dirname, '/securityElement')),
  check: require(path.join(__dirname, '/check')),
  checklist: require(path.join(__dirname, '/checklist')),
  checklistLTres: require(path.join(__dirname, '/checklistLTres')),
  staffNews: require(path.join(__dirname, '/staffNews')),
  eventsTimeline: require(path.join(__dirname, '/eventsTimeline')),
  staffRequest: require(path.join(__dirname, '/staffRequest')),
  extraHoursRequest: require(path.join(__dirname, '/extraHoursRequest')),
  shiftChangeRequest: require(path.join(__dirname, '/shiftChangeRequest')),
  leaveRequest: require(path.join(__dirname, '/leaveRequest')),
  shift: require(path.join(__dirname, '/shift')),
  availability: require(path.join(__dirname, '/availability')),
  sanction: require(path.join(__dirname, '/sanction')),
  announcement: require(path.join(__dirname, '/announcement')),
  meeting: require(path.join(__dirname, '/meeting')),
  position: require(path.join(__dirname, '/position')),
  line: require(path.join(__dirname, '/line')),
  sector: require(path.join(__dirname, '/sector')),
  area: require(path.join(__dirname, '/area')),
  occurrence: require(path.join(__dirname, '/occurrence')),
  supervisionPart: require(path.join(__dirname, '/supervisionPart')),
  supervisionPartLTres: require(path.join(__dirname, '/supervisionPartLTres')),
  hour: require(path.join(__dirname, '/hour')),
  fail: require(path.join(__dirname, '/fail')),
  bugReport: require(path.join(__dirname, '/bugReport'))
}
