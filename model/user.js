'use strict'
const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema
const Bluebird = require('bluebird')
const config = require(path.join(__dirname, '/../config'))
const s3 = require(path.join(__dirname, '/../libs/s3'))
const constants = require(path.join(__dirname, '../libs/const'))
const _ = require('lodash')

const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
  legajo: {
    type: String,
    required: true
  },
  dni: {
    type: String
  },
  lastname: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: String
  },
  birthdate: {
    type: Date
  },
  cuil: {
    type: String
  },
  nationality: {
    type: String
  },
  civil_status: {
    type: String
  },
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Area',
    autopopulate: true
  },
  sector: {
    type: Schema.Types.ObjectId,
    ref: 'Sector',
    autopopulate: true
  },
  position: {
    type: Schema.Types.ObjectId,
    ref: 'Position',
    autopopulate: true
  },
  line: {
    type: Schema.Types.ObjectId,
    ref: 'Line',
    autopopulate: true
  },
  shift: {
    type: Schema.Types.ObjectId,
    ref: 'Shift'
  },
  category: {
    type: String
  },
  union: {
    type: String
  },
  incorporation_date: {
    type: Date
  },
  auth: {
    username: {
      type: String,
      lowerCase: true
    },
    password: String
  },
  user_type: {
    type: String,
    enum: _.values(constants.USER_TYPE)
  },
  notifications: [{
    message: {
      type: String
    },
    url: {
      type: String
    },
    type: {
      type: String,
      enum: _.values(constants.NOTIFICATION_TYPE)
    },
    seen: {
      type: Boolean,
      default: false
    },
    data: {
      type: Schema.Types.Mixed
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  security_element_requests: {
    type: Number,
    default: 1
  },
  security_element_items: {
    type: Number,
    default: 1
  },
  sizes: [{
    _id: false,
    item_description: String,
    item_size: String
  }],
  devices: [],
  s3Key: {
    type: String
  },
  deactivated: {
    type: Boolean,
    default: false
  },
  deactivatedReason: {
    type: String
  },
  email: String,
  landlinePhone: String,
  responsibleOf: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  minimize: false,
  toObject: {
    // HIDE PASSWORD
    transform: function (doc, ret) {
      if (ret.auth !== undefined) {
        delete ret.auth.password
      }
      return ret
    },
    virtuals: true
  },
  toJSON: {
    // HIDE PASSWORD
    transform: function (doc, ret) {
      if (ret.auth !== undefined) {
        delete ret.auth.password
      }
      // Hide s3Key, picture url send with virtual
      ret.s3Key = undefined
      return ret
    },
    virtuals: true
  }
})

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    let self = this
    if (self.auth.password !== undefined) {
      bcrypt
        .hash(self.auth.password, SALT_WORK_FACTOR)
        .then(hash => {
          self.auth.password = hash
          next()
        })
        .catch(next)
    } else {
      next()
    }
  } else {
    next()
  }
})

// checking if password is valid
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.auth.password)
}

// hashing a password
UserSchema.methods.setPassword = function (password) {
  let self = this
  return bcrypt
    .hash(password, SALT_WORK_FACTOR)
    .then(hash => {
      self.auth.password = hash
      return Bluebird.resolve(true)
    })
}

UserSchema.methods.basicInfo = function () {
  return {
    name: this.name,
    lastname: this.lastname,
    legajo: this.legajo
  }
}

UserSchema.statics.exist = function (user) {
  return this.findOne({
    $or: [
      {dni: user.dni},
      {legajo: user.legajo}
    ]
  })
    .then(user => Bluebird.resolve(user !== null))
}

UserSchema.statics.usernameIsTaken = function (username) {
  return this.findOne({'auth.username': username})
    .then(user => Bluebird.resolve(user !== null))
}

UserSchema.statics.addSubscription = function (userId, device) {
  device._id = mongoose.Types.ObjectId().toString()
  return this.update({_id: userId}, {$push: {devices: device}})
    .then(() => Bluebird.resolve(device._id))
}

UserSchema.statics.removeSubscription = function (userId, deviceId) {
  return this.update({_id: userId}, {$pull: {devices: {_id: deviceId}}}).exec()
}

UserSchema.statics.removeNotification = function (userId, notificationId) {
  return this.update({_id: userId},
    {
      $pull: {notifications: {_id: notificationId}}
    }).exec()
}

UserSchema.virtual('picture').get(function () {
  if (this.s3Key !== undefined) {
    return config.AMAZON_S3_URL + s3.getProfilePictureKey(this.s3Key)
  } else {
    return null
  }
})
UserSchema.statics.findManyIds = function (ids) {
  return this.find({'_id': {$in: ids}}, '-notifications')
}

UserSchema.plugin(require('mongoose-autopopulate'))

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel
