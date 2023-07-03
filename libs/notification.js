'use strict'
const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const userModel = require(path.join(__dirname, '/../model')).user
const NOTIFICATION_TYPE = require(path.join(__dirname, '/../libs/const'))
const config = require(path.join(__dirname, '/../config'))
const winston = require('winston')
const webPush = require('web-push')
const _ = require('lodash')
const Agenda = require('agenda')
const Bluebird = require('bluebird')
const agenda = new Agenda({db: {address: config.db.uri}})

webPush.setVapidDetails(
  'mailto:info@ubykuo.com',
  config.wpPublicKey,
  config.wpPrivateKey
)

const sendPushNotification = async(function (receivers, notification, ttl) {
  ttl = ttl | 86400 // 24 hr
  if (process.env.NODE_ENV !== 'test') {
    let users = awaitFor(userModel.find(receivers, {_id: 1, devices: 1}))
    users.forEach(u => {
      u.devices.forEach(subscription => {
        try {
          awaitFor(webPush.sendNotification(subscription, JSON.stringify(notification), {TTL: ttl}))
        } catch (error) {
          // NotRegistered
          if (error.statusCode === 410) {
            // winston.log('debug', 'Subscription not registered')
            userModel.removeSubscription(u._id, subscription._id)
          }
        }
      })
    })
    // winston.log('debug', 'Push notification sent', notification)
  }
})

const notification = {
  sendPush: async(function (receivers, payload, ttl) {
    awaitFor(sendPushNotification(receivers, payload, ttl))
  }),

  /**
   *
   * @param {Object} receivers query of the users that need to receive the notification
   * @param {Payload} payload - the data that will be send in the notification
   * @param {String} payload.message to show on the notification
   * @param {String} payload.url that'll show the thing
   * @param {String} payload.type of the notification
   * @param {number} ttl - time to live of the notification
   */
  send: async(function (receivers, payload, ttl) {
    awaitFor(userModel.find(receivers))
      .filter(u => u.notifications.length >= 50)
      .forEach(u => {
        u.notifications.shift()
        awaitFor(u.save())
      })
    awaitFor(userModel.update(receivers, {$push: {notifications: payload}}, {multi: true}))
    awaitFor(sendPushNotification(receivers, payload, ttl))
    // winston.log('debug', 'Notification saved ', payload)
  })

}

/**
 * Deletes all notifications jobs
 */
function clearAll () {
  agenda.cancel({})
}

function findJob (id) {
  return new Bluebird(function (resolve, reject) {
    agenda.jobs({'data.id': id}, function (error, jobs) {
      if (error) reject(error)
      resolve(jobs)
    })
  })
}

/**
 * It handles all the notification system in the app
 */

module.exports = {

  NOTIFICATION_TYPE: NOTIFICATION_TYPE,

  Payload: class Payload {
    /**
     * @param {string} message that'll appear in the notification
     * @param {string} url - url where the notification will redirect
     * @param {string} type - the type of the notification (more info in model users)
     * @param {Object} data - extra data to be sent
     */
    constructor (message, url, type, data) {
      this.message = message
      this.url = url
      this.type = type
      this.data = data
    }
  },

  /**
   * Initialize the service defining all the events that will be called
   */
  init: async(function () {
    agenda.define('notification', async(function (job, done) {
      awaitFor(notification.send(JSON.parse(job.attrs.data.receivers), job.attrs.data.payload, job.attrs.data.ttl))
      done()
    }))

    agenda.define('push-notification', async(function (job, done) {
      awaitFor(notification.sendPush(JSON.parse(job.attrs.data.receivers), job.attrs.data.payload, job.attrs.data.ttl))
      done()
    }))

    awaitFor(new Bluebird(resolve => agenda.once('ready', resolve)))
    agenda.start()
    /*
    if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'development') {
      clearAll()
    }
    */
  }),

  /**
   * Send an app notification (including a push one)
   * @param {Object} receivers - a Mongo query of the users that need to receive the notification
   * @param {Payload} payload - the data that will be send in the notification
   */
  sendNotification: async(function (receivers, payload, ttl) {
    awaitFor(notification.send(receivers, payload, ttl))
  }),

  /**
   * Schedule an app notification (including a push one) at a specific time
   * @param {int} delay
   * @param {Object} receivers - a Mongo query of the users that need to receive the notification
   * @param {Payload} payload - the data that will be send in the notification
   * @param {number} ttl - time to live of the notification
   * @param {string} id - some id to identify the notification (useful to cancel the notification)
   */
  scheduleNotification: async(function (delay, receivers, payload, ttl, id) {
    if (typeof delay === 'number') delay = new Date(new Date().getTime() + delay)
    agenda.schedule(delay, 'notification', {
      payload: payload,
      receivers: JSON.stringify(receivers),
      ttl: ttl,
      id: id
    })
  }),

  /**
   * Send the same app notification (including a push one) every some time using the agenda js job lib
   * @param {(Number|string)} interval - Number in milliseconds or String in human-readable or cron
   * @param {Object} receivers - a Mongo query of the users that need to receive the notification
   * @param {Payload} payload - the data that will be send in the notification
   * @param {number} ttl - time to live of the notification
   * @param {string} id - some id to identify the notification (useful to cancel the notification)
   */
  notificationEvery: async(function (interval, receivers, payload, ttl, id) {
    const job = agenda.create('notification', {
      payload: payload,
      receivers: JSON.stringify(receivers),
      id: id,
      ttl: ttl
    })
    job.attrs.type = 'normal'
    job.repeatEvery(interval)
    job.computeNextRunAt()
    job.save()
  }),

  /**
   * Send the same push notification with given interval using the agenda js job lib
   * @param {(Number|string)} interval - Number in milliseconds or String in human-readable or cron
   * @param {Object} receivers - a Mongo query of the users that need to receive the notification
   * @param {Payload} payload - the data that will be send in the notification
   * @param {number} ttl - time to live of the notification
   * @param {string} id - some id to identify the notification (useful to cancel the notification)
   */
  pushNotificationEvery: async(function (interval, receivers, payload, ttl, id) {
    // timeout to not send the notification right away
    setTimeout(() => {
      const job = agenda.create('push-notification', {
        payload: payload,
        receivers: JSON.stringify(receivers),
        id: id,
        ttl: ttl
      })
      job.attrs.type = 'normal'
      job.repeatEvery(interval)
      job.computeNextRunAt()
      job.save()
    }, interval)
  }),

  pushNotification: notification.sendPush,

  /**
   * Cancel some notification (useful to cancel reminders)
   *  @param {string} id - the id to the notification to cancel
   */
  clearNotification: async(function (id) {
    agenda.cancel({'data.id': id})
  }),

  /**
   *Returns true if a job for an id exists
   * @param {string} id - the id to the notification to cancel
   */
  notificationExists: async(function (id) {
    const jobs = awaitFor(findJob(id))
    return jobs.length !== 0
  })
}
