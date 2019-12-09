const EventEmitter = require('events')

class AvailabilityEmitter extends EventEmitter {
  constructor () {
    super()
    this.observers = []
    const self = this
    this.on('changeOfAvailability', (document) => {
      self.observers.forEach(o => {
        o.changeOfAvailability(document)
      })
    })
    this.on('cancelOfAvailability', (document) => {
      self.observers.forEach(o => {
        o.cancelOfAvailability(document)
      })
    })
    this.on('updateOfAvailability', (document) => {
      self.observers.forEach(o => {
        o.updateOfAvailability(document)
      })
    })
  }

  subscribe (subscriber) {
    this.observers.push(subscriber)
  }

  unsubscribe (subscriber) {
    this.observers.splice(this.observers.indexOf(subscriber), 1)
  }
}

module.exports = (function () {
  let availabilityEmitterInstance
  return {
    getInstance: function () {
      if (!availabilityEmitterInstance) {
        availabilityEmitterInstance = new AvailabilityEmitter()
      }
      return availabilityEmitterInstance
    }
  }
})()
