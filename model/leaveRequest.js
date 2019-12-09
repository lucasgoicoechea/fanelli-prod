const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const AvailabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
const Schema = mongoose.Schema
const COLLECTION_NAME = 'LeaveRequest'
/**
 * It represents a leave request where a collaborator asks for permission to be late at work / to leave early / to be absent this is represented by de the type
 * the days of the changed are saved in days
 * if it's early or late type , it must have a time to indicate the hour
 * Has to be a reason to this request
 */
const LeaveRequestSchema = new Schema(
  {
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
    type: {
      type: String,
      enum: ['ABSENT', 'LATE', 'EARLY']
    },
    days: [Date],
    time: String,
    reason: String,
    resolution: {
      type: String,
      enum: Object.keys(Const.LEAVE_RESOLUTION).map(r => Const.LEAVE_RESOLUTION[r])
    },
    daysToCompensate: [{
      from: Date,
      to: Date
    }],
    dayOff: Boolean,
    deduct: Boolean,
    returns: {
      type: Boolean,
      default: false
    },
    returnsTime: String,
    state: {
      type: Number,
      enum: Const.STAFF_REQUEST_STATE,
      default: Const.STAFF_REQUEST_STATE.PENDING_APPROVAL
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    printed: {
      type: Boolean,
      default: false
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
    canceledBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  })

LeaveRequestSchema.pre('save', function (next) {
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

LeaveRequestSchema.methods.readableType = function () {
  switch (this.type) {
    case Const.LEAVE_REQUEST_TYPE.ABSENT:
      return 'Solicitud de Falta'
    case Const.LEAVE_REQUEST_TYPE.EARLY:
      return 'Solicitud de Salida'
    case Const.LEAVE_REQUEST_TYPE.LATE:
      return 'Solicitud de Llegada Tarde'
  }
}

LeaveRequestSchema.methods.getType = function () {
  return Const.STAFF_REQUEST_TYPE.LEAVE.toLowerCase().replace('_', '-')
}

LeaveRequestSchema.methods.getTypeNotification = function () {
  return Const.NOTIFICATION_TYPE.LEAVE
}

LeaveRequestSchema.methods.getRegisterNumber = function () {
  switch (this.type) {
    case Const.LEAVE_REQUEST_TYPE.ABSENT:
      return 'REG-RRHH-006'
    case Const.LEAVE_REQUEST_TYPE.EARLY:
      return 'REG-RRHH-007'
    case Const.LEAVE_REQUEST_TYPE.LATE:
      return 'REG-RRHH-008'
  }
}

LeaveRequestSchema.methods.printableDetails = function () {
  const details = []
  const dates = this.days.map(day => dateFns.format(day, 'DD/MM/YYYY'))
  details.push({key: 'Dias: ', value: dates.join(',')})
  const leaveObject = this.toObject()
  if (leaveObject.hasOwnProperty('time') && leaveObject.time !== null) {
    details.push({key: 'A las: ', value: this.time})
  }

  switch (this.resolution) {
    case Const.LEAVE_RESOLUTION.COMPENSATE:
      if (this.daysToCompensate.length !== 0) {
        details.push({key: 'Compensa', value: ''})
        this.daysToCompensate.forEach(d => {
          const formattedFrom = dateFns.format(d.from, 'DD/MM/YYYY H:mm A')
          const formattedTo = dateFns.format(d.to, 'DD/MM/YYYY H:mm A')
          details.push({key: 'de: ', value: formattedFrom + ' - ' + formattedTo})
        })
      } else {
        details.push({key: 'Compensa pero no se cargaron fechas para compensar', value: ''})
      }
      break
    case Const.LEAVE_RESOLUTION.DAY_OFF:
      details.push({key: 'Franco', value: ''})
      break
    case Const.LEAVE_RESOLUTION.NO_COMPENSATE:
      details.push({key: 'No compensa', value: ''})
      break
    case Const.LEAVE_RESOLUTION.NO_DEDUCT:
      details.push({key: 'No descuenta', value: ''})
      break
  }
  if (leaveObject.returns) {
    details.push({key: 'Regresa a las: ', value: this.returnsTime})
  }

  if (leaveObject.hasOwnProperty('reason')) {
    details.push({key: 'Motivo: ', value: this.reason})
  }

  return details
}

LeaveRequestSchema.methods.generateAvailability = function (availability) {
  const unavailabilityDocument = {
    request: this,
    collectionRequest: COLLECTION_NAME,
    type: 'LEAVE_REQUEST_' + this.type
  }
  if (this.time) {
    unavailabilityDocument.time = {
      from: this.time
    }
  }

  if (this.return) {
    unavailabilityDocument.time.to = this.returnsTime
  }

  this.collaborators.forEach(c => {
    unavailabilityDocument.collaborator = c
    this.days.forEach(d => {
      unavailabilityDocument.from = d
      unavailabilityDocument.to = d
      availability.addUnavailability(unavailabilityDocument)
    })
  })

  // if the collaborators have to compensate, we need to generate the availability for compensation.
  if (this.resolution === Const.LEAVE_RESOLUTION.COMPENSATE) {
    this.daysToCompensate.forEach(dtc => {
      const availabilityDocument = {
        from: dateFns.startOfDay(dtc.from),
        to: dateFns.startOfDay(dtc.to),
        request: this,
        collectionRequest: COLLECTION_NAME,
        time: {
          from: dateFns.format(dtc.from, 'HH:mm'),
          to: dateFns.format(dtc.to, 'HH:mm')
        },
        type: 'COMPENSATE'
      }
      this.collaborators.forEach(c => {
        availabilityDocument.collaborator = c
        availability.addAvailability(availabilityDocument)
      })
    })
  }
}

LeaveRequestSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  switch (this.type) {
    case Const.LEAVE_REQUEST_TYPE.ABSENT:
      excelObject.type = 'Solicitud de ausencia'
      break
    case Const.LEAVE_REQUEST_TYPE.LATE:
      excelObject.type = 'Solicitud de Falta'
      break
    case Const.LEAVE_REQUEST_TYPE.EARLY:
      excelObject.type = 'Solicitud de salida temprana'
      break
  }
  excelObject.dates = this.days

  excelObject.data = `Dias: ${this.days.map(day => dateFns.format(day, 'DD/MM/YYYY')).join(', ')}.` +
  ` A las: ${this.time ? this.time : ''}${this.returnsTime ? ', Retorna: ' + this.returnsTime : ''}` +
  ` Motivo: ${this.reason}. ${this.exculpatory ? 'Descargo: ' + this.exculpatory + ' ' : ''}` +
  ` ${this.resolution === Const.LEAVE_RESOLUTION.COMPENSATE ? 'Compensa' : 'No compensa'}`
  return excelObject
}

LeaveRequestSchema.query.teamOf = queryTeam('collaborators')

const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema)
module.exports = LeaveRequest
