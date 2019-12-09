'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const Const = require(path.join(__dirname, '/../libs/const'))
const dateFns = require('date-fns')

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * d enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = async(function (db) {
  const availabilityCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('availabilities')
  const availability = {
    addUnavailability: async(function (document) {
      document.isAvailable = false
      try {
        awaitFor(availabilityCollection.insert(document))
      } catch (e) {
        console.log(e)
      }
    }),

    addAvailability: async(function (document) {
      document.isAvailable = true
      try {
        awaitFor(availabilityCollection.insert(document))
      } catch (e) {
        console.log(e)
      }
    })
  }

  const leaveRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('leaverequests')
  const extraHoursRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('extrahoursrequests')
  const shiftChangeRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('shiftchangerequests')
  const staffRequestCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('staffrequests')
  const staffNewsCollection = awaitFor(db._run('getDbInstance')).db(process.env.DB_NAME).collection('staffnews')
  awaitFor(generateLeaveRequestAvailabilities(leaveRequestCollection, availability))
  awaitFor(generateStaffRequestAvailabilities(staffRequestCollection, availability))
  awaitFor(generateShiftChangeRequestAvailabilities(shiftChangeRequestCollection, availability))
  awaitFor(generateExtraHoursRequestAvailabilities(extraHoursRequestCollection, availability))
  awaitFor(generateStaffNewsAvailabilities(staffNewsCollection, availability))
  awaitFor(availabilityCollection.remove({$where: 'this.from > this.to'}))
  awaitFor(availabilityCollection.remove({type: 'MEDICAL_LICENSE'}))
})

exports.down = function (db) {
  return null
}
const generateLeaveRequestAvailabilities = async(
  (model, availability) => {
    const documents = awaitFor(model.find({}))
    documents.forEach(d => {
      const unavailabilityDocument = {
        request: d._id,
        collectionRequest: 'LeaveRequest',
        type: 'LEAVE_REQUEST_' + d.type
      }

      if (d.time) {
        unavailabilityDocument.time = {
          from: d.time
        }
      }

      if (d.return) {
        unavailabilityDocument.time.to = d.returnsTime
      }

      d.collaborators.forEach(c => {
        unavailabilityDocument.collaborator = c
        d.days.forEach(d => {
          unavailabilityDocument.from = d
          unavailabilityDocument.to = d
          availability.addUnavailability(unavailabilityDocument)
        })
      })

      // if the collaborators have to compensate, we need to generate the availability for compensation
      if (d.resolution === Const.LEAVE_RESOLUTION.COMPENSATE) {
        d.daysToCompensate.forEach(dtc => {
          const availabilityDocument = {
            from: dateFns.startOfDay(dtc.from),
            to: dateFns.startOfDay(dtc.to),
            request: d._id,
            collectionRequest: 'LeaveRequest',
            time: {
              from: dateFns.format(dtc.from, 'HH:mm'),
              to: dateFns.format(dtc.to, 'HH:mm')
            },
            type: 'COMPENSATE'
          }
          d.collaborators.forEach(c => {
            availabilityDocument.collaborator = c
            availability.addAvailability(availabilityDocument)
          })
        })
      }
    })
  })

const generateStaffNewsAvailabilities = async(
  (model, availability) => {
    const documents = awaitFor(model.find({}))
    documents.forEach(d => {
      if (d.type !== 'OBSERVATION') {
        const availabilityDocument = {
          from: dateFns.startOfDay(d.created_at),
          to: dateFns.startOfDay(d.created_at),
          collaborator: d.collaborator,
          collectionRequest: 'StaffNews',
          request: d._id,
          type: 'STAFF_NEWS_' + d.type
        }
        if (d.time !== undefined) {
          availabilityDocument.time = {
            from: d.time
          }
        }
        availability.addUnavailability(availabilityDocument, d.collaborator)
      }
    })
  })

const generateShiftChangeRequestAvailabilities = async(
  (model, availability) => {
    const documents = awaitFor(model.find({}))
    documents.forEach(d => {
      if (d.state === Const.STAFF_REQUEST_STATE.APPROVED && d.archived && !d.canceled && d.temporary) {
        const availabilityDocument = {
          collectionRequest: 'ShiftChangeRequest',
          request: d._id,
          type: Const.AVAILABILITY_TYPE.SHIFT_CHANGE,
          from: d.days.from,
          to: d.days.to
        }
        d.collaborators.forEach(c => {
          availabilityDocument.collaborator = c
          availability.addUnavailability(availabilityDocument)
          availability.addAvailability(availabilityDocument)
        })
      }
    })
  })

const generateExtraHoursRequestAvailabilities = async(
  (model, availability) => {
    const documents = awaitFor(model.find({}))
    documents.forEach(d => {
      if (d.state === Const.STAFF_REQUEST_STATE.APPROVED && d.archived && !d.canceled) {
        const availabilityDocument = {
          collectionRequest: 'ExtraHoursRequest',
          request: d._id,
          type: Const.AVAILABILITY_TYPE.EXTRA_HOURS,
          time: d.time
        }
        d.collaborators.forEach(c => {
          d.days.forEach(d => {
            availabilityDocument.collaborator = c
            availabilityDocument.from = d
            availabilityDocument.to = d
            availability.addAvailability(availabilityDocument)
          })
        })
      }
    })
  })

const generateStaffRequestAvailabilities = async(
  (model, availability) => {
    const documents = awaitFor(model.find({}))
    documents.forEach(d => {
      const unavailabilityDocument = {
        collaborator: d.collaborator,
        collectionRequest: 'StaffRequest',
        request: d._id,
        type: d.type
      }
      if (d.type !== Const.LICENSE_TYPE.MEDICAL_ORDER && d.type !== Const.LICENSE_TYPE.MEDICAL_REPORT) {
        unavailabilityDocument.from = d.initialDate
        unavailabilityDocument.to = d.incorporationDate
      } else if (d.type === Const.LICENSE_TYPE.MEDICAL_ORDER) {
        unavailabilityDocument.from = d.medicalAppointment
        unavailabilityDocument.to = d.medicalAppointment
      } else {
        unavailabilityDocument.from = dateFns.startOfDay(d.created_at)
        unavailabilityDocument.to = d.medicalDischarge ? d.dischargeDate : d.nextMedicalVisit
      }
      availability.addUnavailability(unavailabilityDocument)
    })
  })
exports._meta = {
  'version': 1
}
