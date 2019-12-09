const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
/**
 * This model represents the existing shifts, it consists of
 * a value that's the name of the shift
 * a from data field that's the initial date when the rules applies
 * a flag indicating if it's a rotative shift
 * an array of rules with
 * days how many continuous days the rules applies.
 * hours hoy many time this rule applies (in milliseconds, yeah sorry) TODO change to milliseconds
 * in string that represents the initial hour of the rule, 24hs format
 * franco a flag indicating if the rule if it's day off
 *  */
const shiftScheme = new Schema({
  value: {
    type: 'String',
    required: true
  },
  from: {
    type: Date
  },
  rotative: {
    type: Boolean,
    default: false
  },
  rules: [{
    days: {
      type: Number
    },
    in: {
      type: String
    },
    hours: {
      type: Number
    },
    franco: {
      type: Boolean,
      default: false
    }
  }],
  description: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const ShiftModel = mongoose.model('Shift', shiftScheme)
module.exports = ShiftModel
