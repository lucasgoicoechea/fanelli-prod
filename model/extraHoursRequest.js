const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const Schema = mongoose.Schema
const AvailabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
const COLLECTION_NAME = 'ExtraHoursRequest'
const extraHoursRequestSchema = new Schema({
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  days: [Date],
  reason: String,
  time: {
    from: String,
    to: String
  },
  state: {
    type: Number,
    enum: Const.STAFF_REQUEST_STATE,
    default: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  archived: {
    type: Boolean,
    default: false
  },
  approvedDate: Date,
  canceled: {
    type: Boolean,
    default: false
  },
  printed: {
    type: Boolean,
    default: false
  },
  canceledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

extraHoursRequestSchema.methods.readableType = function () {
  return 'Solicitud de Horas Extra'
}

extraHoursRequestSchema.methods.getRegisterNumber = function () {
  return 'REG-RRHH-011'
}

extraHoursRequestSchema.methods.getType = function () {
  return Const.STAFF_REQUEST_TYPE.EXTRA_HOURS.toLowerCase().replace('_', '-')
}

extraHoursRequestSchema.methods.getTypeNotification = function () {
  return Const.NOTIFICATION_TYPE.EXTRA_HOURS
}

extraHoursRequestSchema.methods.printableDetails = function () {
  const detailsMap = []
  const dates = this.days.map(day => dateFns.format(day, 'DD/MM/YYYY'))
  detailsMap.push({key: 'Dias: ', value: dates.join(',')})
  detailsMap.push({key: 'Horas: ', value: this.time.from + ' ' + this.time.to})
  const extraHoursObject = this.toObject()
  if (extraHoursObject.hasOwnProperty('reason')) {
    detailsMap.push({key: 'Motivo: ', value: this.reason})
  }
  return detailsMap
}

extraHoursRequestSchema.pre('save', function (next) {
  // if the request is being approved: is approved, isn't being approved and isn't being archived and isn't being printed
  if (this.state === Const.STAFF_REQUEST_STATE.APPROVED && !this.canceled && !this.archived && !this.printed) {
    AvailabilityEmitter.getInstance().emit('changeOfAvailability', this)
  }

  // if the request is being canceled and it's not archived
  if (this.canceled && !this.archived) {
    AvailabilityEmitter.getInstance().emit('cancelOfAvailability', this)
  }
  next()
})

extraHoursRequestSchema.methods.generateAvailability = function (availability) {
  const availabilityDocument = {
    collectionRequest: COLLECTION_NAME,
    request: this,
    type: Const.AVAILABILITY_TYPE.EXTRA_HOURS,
    time: this.time
  }
  this.collaborators.forEach(c => {
    this.days.forEach(d => {
      availabilityDocument.collaborator = c
      availabilityDocument.from = d
      availabilityDocument.to = d
      availability.addAvailability(availabilityDocument)
    })
  })
}

extraHoursRequestSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  excelObject.dates = this.days
  excelObject.type = 'Horas Extra'
  excelObject.data = `Dias: ${this.days.map(day => dateFns.format(day, 'DD/MM/YYYY').join(', '))}.` +
    ` Desde ${this.time.from}, Hasta ${this.time.to}` +
    ` Motivo: ${this.reason} `
}

extraHoursRequestSchema.query.teamOf = queryTeam('collaborators')

const ExtraHoursRequestModel = mongoose.model(COLLECTION_NAME, extraHoursRequestSchema)

module.exports = ExtraHoursRequestModel
