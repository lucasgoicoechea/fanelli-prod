const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const AvailabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const Schema = mongoose.Schema
const COLLECTION_NAME = 'ShiftChangeRequest'
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
const ShiftChangeRequestSchema = new Schema({
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  changesWith: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  byFabric: {
    type: Boolean
  },
  temporary: {
    type: Boolean
  },
  rotatingShift: {
    type: Boolean
  },
  toShift: {
    type: Schema.Types.ObjectId,
    ref: 'Shift'
  },
  days: {
    from: Date,
    to: Date
  },
  reason: String,
  state: {
    type: Number,
    enum: Const.MEETING_STATE,
    default: Const.MEETING_STATE.PENDING_APPROVAL
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
ShiftChangeRequestSchema.methods.readableType = function () {
  return 'Solicitud de Cambio de turno'
}
ShiftChangeRequestSchema.methods.getRegisterNumber = function () {
  return 'REG-RRHH-018'
}

ShiftChangeRequestSchema.methods.getType = function () {
  return Const.STAFF_REQUEST_TYPE.SHIFT_CHANGE.toLowerCase().replace('_', '-')
}
ShiftChangeRequestSchema.methods.getTypeNotification = function () {
  return Const.NOTIFICATION_TYPE.SHIFT_CHANGE
}

ShiftChangeRequestSchema.methods.printableDetails = function () {
  const detailsMap = []
  const shiftChangeObject = this.toObject()
  if (shiftChangeObject.temporary) {
    detailsMap.push({
      key: 'Dias: ',
      value: dateFns.format(this.days.from, 'DD/MM/YYYY') + '-' + dateFns.format(this.days.to, 'DD/MM/YYYY')
    })
  } else {
    detailsMap.push({key: 'Desde: ', value: dateFns.format(this.days.from, 'DD/MM/YYYY')})
  }
  detailsMap.push({key: 'Al turno: ', value: this.toShift.value + ' (' + this.toShift.description + ')'})
  if (shiftChangeObject.hasOwnProperty('reason')) {
    detailsMap.push({key: 'Motivo: ', value: this.reason})
  }

  if (shiftChangeObject.byFabric) {
    detailsMap.push({key: 'Requerido por: ', value: 'Fabrica'})
  }

  return detailsMap
}

ShiftChangeRequestSchema.pre('save', function (next) {
  // if the request is being approved: is approved, isn't being approved and isn't being archived and isn't being printed
  if (this.state === Const.STAFF_REQUEST_STATE.APPROVED && !this.canceled && this.temporary && !this.printed) {
    AvailabilityEmitter.getInstance().emit('changeOfAvailability', this)
  }

  // if the request is being canceled and it's not archived
  if (this.canceled && !this.archived) {
    AvailabilityEmitter.getInstance().emit('cancelOfAvailability', this)
  }
  next()
})

ShiftChangeRequestSchema.methods.generateAvailability = function (availability) {
  const availabilityDocument = {
    collectionRequest: COLLECTION_NAME,
    request: this,
    type: Const.AVAILABILITY_TYPE.SHIFT_CHANGE,
    from: this.days.from,
    to: this.days.to
  }
  this.collaborators.forEach(c => {
    availabilityDocument.collaborator = c
    availability.addUnavailability(availabilityDocument)
    availability.addAvailability(availabilityDocument)
  })
}

ShiftChangeRequestSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  if (this.temporary) {
    excelObject.dates = dateFns.eachDay(this.days.from, this.days.to)
    excelObject.type = 'Cambio de Turno Temporal'
    excelObject.data = `Desde: ${dateFns.format(this.days.from, 'DD/MM/YYYY')} Hasta: ${dateFns.format(this.days.to, 'DD/MM/YYYY')}. Pedido por ${this.byFabric ? 'Fabrica' : 'Colaborador'} ${this.reason}.`
  } else {
    excelObject.dates = dateFns.eachDay(this.days.from, this.days.from)
    excelObject.type = 'Cambio de Turno'
    excelObject.data = `A partir del: ${dateFns.format(this.days.from, 'DD/MM/YYYY')}. Pedido por ${this.byFabric ? 'Fabrica' : 'Colaborador'}. ${this.reason}`
  }
  return excelObject
}

ShiftChangeRequestSchema.query.teamOf = queryTeam('collaborators')

const ShiftChangeRequest = mongoose.model(COLLECTION_NAME, ShiftChangeRequestSchema)
module.exports = ShiftChangeRequest
