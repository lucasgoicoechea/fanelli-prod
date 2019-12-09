'use strict'
const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Const = require(path.join(__dirname, '/../libs/const'))
const Schema = mongoose.Schema
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const config = require(path.join(__dirname, '/../config'))
const s3 = require(path.join(__dirname, '/../libs/s3'))
const dateFns = require('date-fns')
const winston = require('winston')
const constant = require(path.join(__dirname, '/../libs/const'))
const AvailabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const writtenNumber = require('written-number')
const COLLECTION_NAME = 'StaffRequest'
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
/**
 * Change of requirements made that this model only represent a license ,not a staff request
 * A license isn't even a staff request, it doesn't have the same flow as a staff request
 * but the refactor of this is very time  expensive
 * so implicitly this is a license model and should be use as that
 *
 */
const StaffRequestSchema = new Schema(
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
      enum: Object.keys(constant.LICENSE_TYPE).map(t => constant.LICENSE_TYPE[t])
    },
    observation: {
      type: String
    },
    incorporationDate: {
      type: Date
    },
    initialDate: {
      type: Date
    },
    medicalAppointment: {
      type: Date
    },
    nextMedicalVisit: {
      type: Date
    },
    symptom: {
      type: String
    },
    medicalType: {
      type: String,
      enum: Object.keys(constant.STAFF_REQUEST_MEDICAL_TYPE).map(t => constant.STAFF_REQUEST_MEDICAL_TYPE[t])
    },
    medicalOrderPath: {
      type: String
    },
    medicalDischarge: {
      type: Boolean
    },
    dischargeDate: {
      type: Date
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

StaffRequestSchema.virtual('medicalOrder').get(function () {
  if (this.medicalOrderPath !== undefined) {
    return config.AMAZON_S3_URL + s3.getKey(this.medicalOrderPath)
  } else {
    return undefined
  }
})

StaffRequestSchema.pre('save', function (next) {
  if (this.isNew) {
    AvailabilityEmitter.getInstance().emit('changeOfAvailability', this)
  }
  next()
})

StaffRequestSchema.post('update', async(function (doc, next) {
  // in this context THIS is the model
  const newDocument = this.getUpdate().$set
  if (newDocument.medicalAppointment || newDocument.nextMedicalVisit || newDocument.dischargeDate || newDocument.initialDate || newDocument.incorporationDate) {
    const documentUpdated = awaitFor(this.findOne({_id: this.getQuery()._id}))
    AvailabilityEmitter.getInstance().emit('updateOfAvailability', documentUpdated)
  }
  next()
}))

StaffRequestSchema.pre('remove', function (next) {
  AvailabilityEmitter.getInstance().emit('cancelOfAvailability', this)
  next()
})

StaffRequestSchema.methods.generateAvailability = function (availability) {
  const unavailabilityDocument = {
    collaborator: this.collaborator,
    collectionRequest: COLLECTION_NAME,
    request: this,
    type: this.type
  }
  if (this.type !== Const.LICENSE_TYPE.MEDICAL_ORDER && this.type !== Const.LICENSE_TYPE.MEDICAL_REPORT) {
    unavailabilityDocument.from = this.initialDate
    unavailabilityDocument.to = this.incorporationDate
  } else if (this.type === Const.LICENSE_TYPE.MEDICAL_ORDER) {
    unavailabilityDocument.from = this.medicalAppointment
    unavailabilityDocument.to = this.medicalAppointment
  } else {
    unavailabilityDocument.from = dateFns.startOfDay(this.created_at)
    unavailabilityDocument.to = this.medicalDischarge ? this.dischargeDate : this.nextMedicalVisit
  }
  availability.addUnavailability(unavailabilityDocument)
}

StaffRequestSchema.methods.updateAvailability = function (availability) {
  const unavailabilityDocument = {
    request: this
  }
  if (this.type !== Const.LICENSE_TYPE.MEDICAL_ORDER && this.type !== Const.LICENSE_TYPE.MEDICAL_REPORT) {
    unavailabilityDocument.from = this.initialDate
    unavailabilityDocument.to = this.incorporationDate
  } else if (this.type === Const.LICENSE_TYPE.MEDICAL_ORDER) {
    unavailabilityDocument.from = this.medicalAppointment
    unavailabilityDocument.to = this.medicalAppointment
  } else {
    unavailabilityDocument.to = this.medicalDischarge ? this.dischargeDate : this.nextMedicalVisit
  }
  availability.replaceAvailability(unavailabilityDocument)
}

StaffRequestSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  if (this.type === Const.LICENSE_TYPE.MEDICAL_REPORT) {
    excelObject.type = 'Carpeta Medica'
    if (this.medicalDischarge) {
      // Some dates were stored incorrectly so i have to do this, otherwise dateFns 'll throw a date error (The first date cannot be after the second date)
      excelObject.dates = dateFns.isBefore(this.created_at, this.dischargeDate) && this.dischargeDate !== undefined
        ? excelObject.dates = dateFns.eachDay(this.created_at, this.dischargeDate)
        : [this.created_at]
      excelObject.data = `Desde: ${dateFns.format(this.created_at, 'DD/MM/YYYY')} Alta: ${dateFns.format(this.dischargeDate, 'DD/MM/YYYY')}`
    } else if (this.nextMedicalVisit) {
      excelObject.dates = dateFns.isBefore(this.created_at, this.nextMedicalVisit) && this.nextMedicalVisit !== undefined
        ? excelObject.dates = dateFns.eachDay(this.created_at, this.nextMedicalVisit)
        : [this.created_at]
      excelObject.data = `Desde: ${dateFns.format(this.created_at, 'DD/MM/YYYY')} Vuelve al medico ${dateFns.format(this.nextMedicalVisit, 'DD/MM/YYYY')}`
    } else {
      excelObject.dates = [this.created_at]
    }
    excelObject.data += `. ${this.observation ? this.observation : ''}`
  } else if (this.type === Const.LICENSE_TYPE.MEDICAL_ORDER) {
    excelObject.type = 'Orden Medica'
    excelObject.dates = dateFns.isBefore(this.created_at, this.medicalAppointment)
      ? excelObject.dates = dateFns.eachDay(this.created_at, this.medicalAppointment)
      : [this.created_at]
    excelObject.data = `Desde: ${dateFns.format(this.created_at, 'DD/MM/YYYY')} va al medico: ${dateFns.format(this.medicalAppointment, 'DD/MM/YYYY')}`
  } else {
    excelObject.dates = dateFns.isBefore(this.initialDate, this.incorporationDate)
      ? excelObject.dates = dateFns.eachDay(this.initialDate, this.incorporationDate)
      : [this.created_at]
    excelObject.type = Const.LICENSE_TYPES_READABLE[this.type]
    excelObject.data = `Desde: ${dateFns.format(this.initialDate, 'DD/MM/YYYY')} Hasta: ${dateFns.format(this.incorporationDate, 'DD/MM/YYYY')} ${this.observation ? this.observation : ''}`
  }
  return excelObject
}

StaffRequestSchema.query.teamOf = queryTeam('collaborator')

const staffRequestModel = mongoose.model(COLLECTION_NAME, StaffRequestSchema)

module.exports = staffRequestModel
