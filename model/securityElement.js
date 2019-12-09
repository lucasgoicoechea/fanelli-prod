'use strict'
const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const config = require(path.join(__dirname, '/../config'))
const Schema = mongoose.Schema
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))

const SecurityElementSchema = new Schema({
  collaborator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    _id: false,
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    colour: {
      type: String
    },
    model: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    certified: {
      type: Boolean
    },
    size: {
      type: String
    },
    cant: {
      type: Number
    }
  }],
  request_date: {
    type: Date,
    required: true
  },
  approved: {
    type: Boolean
  },
  approved_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  // How many requests the employee did to get security elements
  collaborator_request: {
    type: Number
  },
  // How many security elements items the employee got
  number_request: {
    type: Number
  },
  global_request_counter: {
    type: Number
  },
  delivered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

SecurityElementSchema.methods.isEditable = function () {
  const millisecondsDifference = (new Date().getTime() - this.created_at.getTime())
  return millisecondsDifference < config.EPP_EDIT_WINDOW && this.approved === undefined
}

SecurityElementSchema.query.teamOf = queryTeam('collaborator', 'supervisor')

const SecurityElementModel = mongoose.model('SecurityElements', SecurityElementSchema)

module.exports = SecurityElementModel
