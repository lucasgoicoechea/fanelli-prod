const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const AvailabilityEmitter = require(path.join(__dirname, '/../libs/availabilityEmitter'))
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const writtenNumber = require('written-number')
const COLLECTION_NAME = 'sanction'
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
/**
 * @apiDefine sanctionEntity
 * @apiSuccess {Object[]} sanction.collaborators Collaborators sanctioned
 * @apiSuccess {Object} sanction.creator sanction Creator
 * @apiSuccess {String} sanction.type Sanction type, can be WARNING or SUSPENSION
 * @apiSuccess {String} sanction.reason Sanction full reason
 * @apiSuccess {String} sanction.writtenReason Sanction written reason
 * @apiSuccess {Object} [sanction.dateRange] Suspension dates (only in suspension type)
 * @apiSuccess {Date} [sanction.dateRange.from] Suspension initial date
 * @apiSuccess {Date} [sanction.dateRange.to] Suspension ending date
 * @apiSuccess {Date} [sanction.incorporationDate] Suspension incorporation datetime
 *
 * */
const sanctionSchema = new Schema({
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
    enum: Object.keys(Const.SANCTION_TYPE).map(t => Const.SANCTION_TYPE[t]),
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  writtenReason: {
    type: String,
    required: true
  },
  dateRange: {
    from: {
      type: Date
    },
    to: {
      type: Date
    }
  },
  incorporationDate: {
    type: Date
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

sanctionSchema.methods.printableDetails = function () {
  const details = []
  if (this.type === Const.SANCTION_TYPE.SUSPENSION) {
    const differenceInDays = dateFns.differenceInDays(this.dateRange.to, this.dateRange.from) + 1
    details.push({
      key: 'Días de suspension: ',
      value: `${differenceInDays} (${writtenNumber(differenceInDays, {lang: 'es'})}) ${differenceInDays > 1 ? 'días' : 'día'}`
    })
    details.push({
      key: '',
      value: `Desde: ${dateFns.format(this.dateRange.from, 'DD/MM/YYYY')} - Hasta: ${dateFns.format(this.dateRange.to, 'DD/MM/YYYY')}`
    })
  }
  details.push({key: '', value: this.reason})

  if (this.type === Const.SANCTION_TYPE.SUSPENSION) {
    details.push({
      key: 'Nota: ',
      value: `Deberá reintegrarse a sus tareas normales el día ${dateFns.format(this.incorporationDate, 'DD/MM/YYYY')} a las ${dateFns.format(this.incorporationDate, 'H:mm')} hs.`
    })
  }
  return details
}

sanctionSchema.methods.generateAvailability = function (availability) {
  if (this.type === Const.SANCTION_TYPE.SUSPENSION) {
    const unavailabilityDocument = {
      request: this,
      from: dateFns.startOfDay(this.dateRange.from),
      to: dateFns.endOfDay(this.dateRange.to),
      collectionRequest: COLLECTION_NAME,
      type: Const.AVAILABILITY_TYPE.SUSPENSION
    }
    this.collaborators.forEach(collaborator => {
      unavailabilityDocument.collaborator = collaborator
      availability.addUnavailability(unavailabilityDocument)
    })
  }
}

sanctionSchema.pre('save', function (next) {
  if (this.isNew && this.type === Const.SANCTION_TYPE.SUSPENSION) {
    AvailabilityEmitter.getInstance().emit('changeOfAvailability', this)
  }
  next()
})

sanctionSchema.pre('remove', function (next) {
  if (this.type === Const.SANCTION_TYPE.SUSPENSION) {
    AvailabilityEmitter.getInstance().emit('cancelOfAvailability', this)
  }
  next()
})

sanctionSchema.post('update', async(function (doc, next) {
  // in this context THIS is the model
  const newDocument = this.getUpdate().$set
  if (newDocument.dateRange) {
    const documentUpdated = awaitFor(this.findOne({_id: this.getQuery()._id}))
    AvailabilityEmitter.getInstance().emit('updateOfAvailability', documentUpdated)
  }
  next()
}))

sanctionSchema.methods.updateAvailability = function (availability) {
  if (this.type === Const.SANCTION_TYPE.SUSPENSION) {
    const unavailabilityDocument = {
      request: this,
      from: dateFns.startOfDay(this.dateRange.from),
      to: dateFns.endOfDay(this.dateRange.to)
    }
    availability.replaceAvailability(unavailabilityDocument)
  }
}

sanctionSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  if (this.type === Const.SANCTION_TYPE.SUSPENSION) {
    excelObject.dates = dateFns.eachDay(this.dateRange.from, this.dateRange.to)
    excelObject.type = 'Suspensión'
    const differenceInDays = dateFns.differenceInDays(this.dateRange.to, this.dateRange.from) + 1
    excelObject.data = `Desde: ${dateFns.format(this.dateRange.from, 'DD/MM/YYYY')} - Hasta: ${dateFns.format(this.dateRange.from, 'DD/MM/YYYY')} ${this.writtenReason}. ${differenceInDays} (${writtenNumber(differenceInDays, {lang: 'es'})}) ${differenceInDays > 1 ? 'días' : 'día'} Regresa: ${dateFns.format(this.incorporationDate, 'DD/MM/YYYY')}`
  } else {
    excelObject.dates = dateFns.eachDay(this.created_at, this.created_at)
    excelObject.type = 'Apercibimiento'
    excelObject.data = `${this.writtenReason}.`
  }
  return excelObject
}

sanctionSchema.query.teamOf = queryTeam('collaborators')

const SanctionModel = mongoose.model(COLLECTION_NAME, sanctionSchema)
module.exports = SanctionModel
