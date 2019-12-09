const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const {queryTeam} = require(path.join(__dirname, '/../libs/queryResponsible'))
const eachDay = require('date-fns/each_day')
const Const = require(path.join(__dirname, '/../libs/const'))
/**
 * @apiDefine occurrenceEntity
 * @apiSuccess {Object} occurrence Occurrence Object
 * @apiSuccess {Object[]} occurrence.collaborators Array containing collaborators
 * @apiSuccess {Object} occurrence.creator occurrence creator
 * @apiSuccess {String[]} occurrence.recommendations Occurrence recommendations (OPERATIVE | SAFETY | DISCIPLINE)
 * @apiSuccess {String} occurrence.observation Occurrence observation
 * @apiSuccess {String} occurrence.state Occurrence state (PENDING_RESOLUTION, RESOLVED, REJECTED, CANCELED)
 * @apiSuccess {Date} [occurrence.resolvedDate] date when the occurrence was resolved (RESOLVED, REJECTED and CANCELED states)
 * @apiSuccess {Object} [occurrence.resolvedBy] user that resolved the occurrence
 * @apiSuccess {Boolean} occurrence.archived flag indicating if the occurrence is archived
 * @apiSuccess {Boolean} occurrence.printed flag indicating if the occurrence is archived
 *
 * */
const occurrenceSchema = new Schema({
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
  recommendations: [{
    type: String,
    enum: Object.keys(Const.RECOMMENDATION_TYPE).map(t => Const.RECOMMENDATION_TYPE[t])
  }],
  observation: {
    type: String,
    required: true
  },
  actionPlan: {
    type: String
  },
  state: {
    type: String,
    enum: Object.keys(Const.OCCURRENCE_STATE).map(t => Const.OCCURRENCE_STATE[t]),
    default: Const.OCCURRENCE_STATE.PENDING_RESOLUTION,
    required: true
  },
  resolvedDate: Date,
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  canceledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  archived: {
    type: Boolean,
    default: false
  },
  printed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
occurrenceSchema.methods.toExcelObject = function () {
  const excelObject = {
    dates: [],
    type: '',
    data: ''
  }
  excelObject.dates = eachDay(this.created_at, this.created_at)
  excelObject.type = 'Acontecimiento'
  excelObject.data = this.observation
  return excelObject
}

occurrenceSchema.virtual('registerNumber').get(function () {
  return 'REG-RRHH-0072'
})

occurrenceSchema.methods.printableDetails = function () {
  const details = []
  details.push({
    key: 'Tipo de recomendacion: ',
    value: `${this.recommendations.map(r => Const.OCCURRENCE_RECOMENDATION_READABLE[r]).join(', ')}`
  })
  details.push({
    key: 'Descripcion de incidente : ',
    value: `${this.observation}`
  })
  details.push({
    key: 'Plan de accion y recomendacion correctiva: ',
    value: `${this.actionPlan}`
  })
  return details
}

occurrenceSchema.virtual('notificationType').get(function () {
  return 'OCCURRENCE'
})
occurrenceSchema.query.teamOf = queryTeam('collaborators')

const OccurrenceModel = mongoose.model('occurrence', occurrenceSchema)
module.exports = OccurrenceModel
