const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const constant = require(path.join(__dirname, '../libs/const'))
const Schema = mongoose.Schema

const check = {
  _id: false,
  check: {
    type: Schema.Types.ObjectId,
    ref: 'Check'
  },
  last: {
    value: Boolean,
    extra: Schema.Types.Mixed,
    datetime: {
      type: Date
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  values: [{
    value: Boolean,
    extra: Schema.Types.Mixed,
    date: {
      type: Date,
      default: Date.now
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  comments: [{
    comment: {
      type: String,
      require: true
    },
    check: {
      type: Schema.Types.ObjectId,
      ref: 'Check'
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}

const checklistSchema = new Schema({
  schedule: {
    type: String,
    enum: ['MANIANA', 'TARDE', 'NOCHE']
  },
  sector: {
    type: String,
    enum: Object.getOwnPropertyNames(constant.CHECKS_SECTOR).map(s => constant.CHECKS_SECTOR[s]),
    required: true
  },
  checks: [check],
  late: {
    type: Boolean
  },
  observations: [{
    observation: {
      type: String,
      require: true
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  date: {
    type: Date
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

checklistSchema.statics.getLastChecklistOfSector = function (sector) {
  return this.findOne({sector: sector})
    .populate({path: 'checks.check', model: 'Checks'})
    .populate('checks.comments.supervisor', ['name', 'lastname'])
    .populate('checks.values.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname'])
    .populate('checks.last.supervisor', ['name', 'lastname'])
    .sort({created_at: -1}).limit(1)
}

checklistSchema.statics.getChecklistsForDayAndSector = function (date, sector) {
  // we can't search by date. We must query between beginning of the day and the end of the day
  const beginning = new Date(date.getTime())
  // Adding 24 hs
  const ending = new Date(beginning.getTime() + (24 * 60 * 60 * 1000))
  return this.find({date: {$gte: beginning, $lt: ending}, sector: sector})
    .populate('supervisor', ['name'])
    .populate('checks.comments.supervisor', ['name', 'lastname'])
    .populate('checks.values.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname'])
    .lean()
}

const ChecklistModel = mongoose.model('Checklist', checklistSchema)

module.exports = ChecklistModel
