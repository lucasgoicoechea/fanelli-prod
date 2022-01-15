const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const constant = require(path.join(__dirname, '../libs/const'))
const Schema = mongoose.Schema


const vagonSchma = new Schema({
  _id: false,
  unit: {
    type: String,
    enum: ['ESTANTERIA', 'VAGONETA', 'VAGONETA'],
    default: 'ESTANTERIA'
  },
  number: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  }
})

const materialSchma = new Schema(
  {
    machine: {
      type: String,
      enum: Object.getOwnPropertyNames(constant.SUPERVISION_PART_MACHINE).map(s => constant.SUPERVISION_PART_MACHINE[s]),
      required: false  
    },
    material: {
      type: String,
      enum: Object.getOwnPropertyNames(constant.SUPERVISION_PART_MATERIAL).map(s => constant.SUPERVISION_PART_MATERIAL[s]),
      required: true
    },
    vagons: [vagonSchma]
  }
)

const totalSchma = new Schema({
    machine: {
      type: String,
      enum: Object.getOwnPropertyNames(constant.SUPERVISION_PART_MACHINE).map(s => constant.SUPERVISION_PART_MACHINE[s]),
      required: false  
    },
    material: {
      type: String,
      enum: Object.getOwnPropertyNames(constant.SUPERVISION_PART_MATERIAL).map(s => constant.SUPERVISION_PART_MATERIAL[s]),
      required: true
    },
    number: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    jumpHour: {
      type: Number,
      default: 0
    }
})


const hour = {
  _id: false,
  hour: {
    type: Schema.Types.ObjectId,
    ref: 'Hour'
  },
  supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  durity: {
    type: Number,
    default: 0
  },
  vacuum: {
    type: Number,
    default: 0
  },
  palletsCamara: {
    type: Number,
    default: 0
  },
  palletsContador: {
    type: Number,
    default: 0
  },
  schedule: {
    type: String,
    enum: ['MANIANA', 'TARDE', 'NOCHE'],
    default: 'MANIANA'
  },
  sector: {
    type: String,
    enum: Object.getOwnPropertyNames(constant.CHECKS_SECTOR).map(s => constant.CHECKS_SECTOR[s]),
    required: true
  },
  comments: [{
    comment: {
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
  stoppings:[
    { 
    comment: {
      type: String,
      require: true
    },
    fail: {
      type: Schema.Types.ObjectId,
      ref: 'Fail'
    },
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    minutes: {
        type: Number,
        default: 0
      },
    date: {
      type: Date,
      default: Date.now
    }   
    }
  ],
  last: totalSchma,
  totals: [totalSchma]  
}

const supervisionpartSchema = new Schema({
  supervisorShift: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schedule: {
    type: String,
    enum: ['MANIANA', 'TARDE', 'NOCHE'],
    default: 'MANIANA'
  },
  sector: {
    type: String,
    enum: Object.getOwnPropertyNames(constant.CHECKS_SECTOR).map(s => constant.CHECKS_SECTOR[s]),
    required: true
  },
  hours: [hour],
  last: totalSchma,
  materials: [materialSchma],
  totalBobin: {
    type: Number,
    default: 0
  },
  totalBobinTwo: {
    type: Number,
    default: 0
  },
  totalRepositionPallet: {
    type: Number,
    default: 0
  },
  totalUnitsMachine: {
    type: Number,
    default: 0
  },
  totalDownloadedEstanterias: {
    type: Number,
    default: 0
  },
  totalMinutesWithoutStopping: {
    type: String,
    default: '08:00'
  },
  totalCountUnitMaterials: {
    type: Number,
    default: 0
  },
  totalStoppings: {
    type: Number,
    default: 0
  },
  totalUnits: {
    type: Number,
    default: 0
  },
  totalDurity: {
    type: Number,
    default: 0
  },
  totalPalletsCamara: {
    type: Number,
    default: 0
  },
  totalPalletsContador: {
    type: Number,
    default: 0
  },
  totalVacuum: {
    type: Number,
    default: 0
  },
  countVagon: {
    type: Number,
    default: 0
  },
  total_MOLDE_8: {
    type: Number,
    default: 0
  },
  total_MOLDE_12_6A: {
    type: Number,
    default: 0
  },
  total_MOLDE_12_8A: {
    type: Number,
    default: 0
  },
  total_MOLDE_18: {
    type: Number,
    default: 0
  },
  total_MOLDE_P12: {
    type: Number,
    default: 0
  },
  total_MOLDE_P18: {
    type: Number,
    default: 0
  },
  total_MOLDE_L11: {
    type: Number,
    default: 0
  },
  total_MOLDE_C: {
    type: Number,
    default: 0
  },
  total_MOLDE_DM20: {
    type: Number,
    default: 0
  },
  total_MOLDE_DM27: {
    type: Number,
    default: 0
  },
  total_MOLDE_DM24 :{
    type: Number,
    default: 0
  },
  total_MOLDE_DM4: {
    type: Number,
    default: 0
  },
  total_MOLDE_DIN18: {
    type: Number,
    default: 0
  },
  total_MOLDE_DIN27: {
    type: Number,
    default: 0
  },
  total_MOLDE_COLUMNA: {
    type: Number,
    default: 0
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
  repositionPallets: [totalSchma],
  totals: [totalSchma],
  last: totalSchma
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

supervisionpartSchema.statics.getLastSupervisionPartOfSector = function (sector) {
  return this.findOne({sector: sector})
    .populate({path: 'hours.hour', model: 'Hour'})
    .populate({path: 'hours.stoppings.fail', model: 'Fail'})
    //.populate('checks.comments.supervisor', ['name', 'lastname'])
    .populate('hours.hour', ['text','ordertime'])
    .populate('supervisorShift', ['name', 'lastname'])
    .populate('hours.supervisor', ['name', 'lastname'])
    .populate('creator', ['name', 'lastname'])
    .populate('hours.comments.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname'])
    .populate('hours.stoppings.supervisor', ['name', 'lastname'])
    .sort({created_at: -1}).limit(1)
}

supervisionpartSchema.statics.getSupervisionPartForDayAndSector = function (date, sector) {
  // we can't search by date. We must query between beginning of the day and the end of the day
  const beginning = new Date(date.getTime())
  // Adding 24 hs
  const ending = new Date(beginning.getTime() + (24 * 60 * 60 * 1000))
  return this.find({date: {$gte: beginning, $lt: ending}, sector: sector})
    .populate({path: 'hours.hour', model: 'Hour'})
    .populate({path: 'hours.stoppings.fail', model: 'Fail'})
    //.populate('checks.comments.supervisor', ['name', 'lastname'])
    .populate('hours.hour', ['text','ordertime'])
    .populate('supervisorShift', ['name', 'lastname'])
    .populate('hours.supervisor', ['name', 'lastname'])
    .populate('creator', ['name', 'lastname'])
    .populate('hours.comments.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname'])
    .populate('hours.stoppings.supervisor', ['name', 'lastname'])
    //.sort({created_at: 1})
    .lean()
    
}

supervisionpartSchema.statics.getSupervisionPartForDay = function (date) {
  // we can't search by date. We must query between beginning of the day and the end of the day
  const beginning = new Date(date.getTime())
  // Adding 24 hs
  const ending = new Date(beginning.getTime() + (24 * 60 * 60 * 1000))
  return this.find({date: {$gte: beginning, $lt: ending}})
    .populate({path: 'hours.hour', model: 'Hour'})
    .populate({path: 'hours.stoppings.fail', model: 'Fail'})
    //.populate('checks.comments.supervisor', ['name', 'lastname'])
    .populate('hours.hour', ['text','ordertime'])
    .populate('supervisorShift', ['name', 'lastname'])
    .populate('hours.supervisor', ['name', 'lastname'])
    .populate('creator', ['name', 'lastname'])
    .populate('hours.comments.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname'])
    .populate('hours.stoppings.supervisor', ['name', 'lastname'])
    .lean()
}

// mongoose.set('debug', true)
const SupervisionpartModel = mongoose.model('Supervisionpart', supervisionpartSchema)

module.exports = SupervisionpartModel
