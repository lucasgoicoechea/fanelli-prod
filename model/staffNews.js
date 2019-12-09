'use strict'
const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const AvailabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const Schema = mongoose.Schema
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))

const TYPES = {
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  EARLY: 'EARLY',
  OBSERVATION: 'OBSERVATION',
  ACCIDENT: 'ACCIDENT'
}

const COLLECTION_NAME = 'StaffNews'

const StaffNewsSchema = new Schema(
  {
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: Object.keys(TYPES).map(t => TYPES[t])
    },
    withNotice: {
      type: Boolean
    },
    exculpatory: {
      type: String
    },
    observation: {
      type: String
    },
    finalized: {
      type: String
    },
    time: {
      type: String
    },
    // Representa la cantidad de tiempo descontado (el tiempo en el que no estuvo presente ) dependiendo de la novedad registrada (Tarde o Salida antes)
    discountedTime: {
      type: String
    },
    informed: {
      type: Boolean
    },
    inPlant: {
      type: Boolean
    },
    left: {
      type: Boolean
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

StaffNewsSchema.methods.generateAvailability = function (availability) {
  if (this.type !== TYPES.OBSERVATION) {
    const availabilityDocument = {
      from: dateFns.startOfDay(this.created_at),
      to: dateFns.startOfDay(this.created_at),
      collaborator: this.collaborator,
      collectionRequest: COLLECTION_NAME,
      request: this,
      type: 'STAFF_NEWS_' + this.type
    }
    if (this.time !== undefined) {
      availabilityDocument.time = {
        from: this.time
      }
    }
    availability.addUnavailability(availabilityDocument, this.collaborator)
  }
}

StaffNewsSchema.pre('save', function (next) {
  if (this.isNew) {
    AvailabilityEmitter.getInstance().emit('changeOfAvailability', this)
    next()
  }
})

StaffNewsSchema.pre('remove', function (next) {
  AvailabilityEmitter.getInstance().emit('cancelOfAvailability', this)
  next()
})

StaffNewsSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  switch (this.type) {
    case Const.STAFF_NEWS_TYPE.EARLY:
      excelObject.type = `Salida temprana ${this.withNotice ? 'Con Aviso' : 'Sin Aviso'}`
      break
    case Const.STAFF_NEWS_TYPE.LATE:
      excelObject.type = `Llegada tarde ${this.withNotice ? 'Con Aviso' : 'Sin Aviso'}`
      break
    case Const.STAFF_NEWS_TYPE.ABSENT:
      excelObject.type = `Falta ${this.withNotice ? 'Con Aviso' : 'Sin Aviso'}`
      break
    case Const.STAFF_NEWS_TYPE.ACCIDENT:
      excelObject.type = 'Accidente'
      break
    case Const.STAFF_NEWS_TYPE.OBSERVATION:
      excelObject.type = 'Observación'
      break
  }
  excelObject.dates = dateFns.eachDay(this.created_at, this.created_at)

  excelObject.data = `${this.time ? this.time : ''} ${this.observation}. ${this.exculpatory ? 'Descargo: ' + this.exculpatory : ''}`

  return excelObject
}

StaffNewsSchema.query.teamOf = queryTeam('collaborator')

const StaffNewsModel = mongoose.model('StaffNews', StaffNewsSchema)
StaffNewsModel.TYPES = TYPES

module.exports = StaffNewsModel
