'use strict'
const path = require('path')
const SCHEDULE = require(path.join(__dirname, '../libs/const')).SCHEDULE

// TODO get this information from the DB (consider the asynchronous nature of a find() ), maybe convert this lib to a service
const SHIFT = {
  T1: {
    value: 'T1',
    initialDate: new Date(2017, 8, 8, 6)

  },
  T2: {
    value: 'T2',
    initialDate: new Date(2017, 8, 2, 6)
  },
  T3: {
    value: 'T3',
    initialDate: new Date(2017, 8, 20, 6)
  },
  T4: {
    value: 'T4',
    initialDate: new Date(2017, 8, 14, 6)
  }
}

function getScheduleForShift (shift, date) {
  let initialDate = shift.initialDate
  let daysPassed = Math.round((date - initialDate) / (1000 * 60 * 60 * 24))
  let shiftsPassed = Math.floor(daysPassed / 8)
  let mod = daysPassed % 8
  let schedule
  /*
  * Horario 0 06:00 - 14:00
  * Horiario 1 22:00 - 06:00
  * Horario 2 14:00 - 22:00
  */
  if (mod === 7 || mod === 6) {
    schedule = SCHEDULE.FRANCO
  } else {
    let shift = shiftsPassed % 3
    switch (shift) {
      case (0):
        schedule = SCHEDULE.MANIANA
        break
      case (1):
        schedule = SCHEDULE.NOCHE
        break
      case (2):
        schedule = SCHEDULE.TARDE
        break
    }
  }
  return schedule
}

function getShiftForSchedule (schedule, date) {
  if (getScheduleForShift(SHIFT.T1, date).value === schedule) {
    return SHIFT.T1.value
  } else if (getScheduleForShift(SHIFT.T2, date).value === schedule) {
    return SHIFT.T2.value
  } else if (getScheduleForShift(SHIFT.T3, date).value === schedule) {
    return SHIFT.T3.value
  } else if (getScheduleForShift(SHIFT.T4, date).value === schedule) {
    return SHIFT.T4.value
  }
}

function getSchedule (date) {
  let hours = date.getHours()
  if (hours >= 6 && hours < 14) {
    return SCHEDULE.MANIANA
  } else if (hours >= 14 && hours < 22) {
    return SCHEDULE.TARDE
  } else {
    return SCHEDULE.NOCHE
  }
}

function getShift (date) {
  if (date === undefined) date = new Date()
  return getShiftForSchedule(getSchedule(date).value, date)
}

/**
 * For a specific day it returns an array with the schedule object (definition above) along with the shift that works that day on that hour
 * @param date of the wanted distribution
 * @return {Array}
 */
function dayShiftDistribution (date) {
  const day = new Date(date.toDateString())
  const distribution = []
  Object.getOwnPropertyNames(SCHEDULE)
    .filter(s => SCHEDULE[s].value !== 'FRANCO' && SCHEDULE[s].value !== 'SIN_TURNO')
    .forEach(s => {
      day.setHours(SCHEDULE[s].begins)
      distribution.push(
        {
          schedule: SCHEDULE[s],
          shift: getShift(day)
        }
      )
    })
  return distribution
}

module.exports = {
  getShift: getShift,
  getSchedule: getSchedule,
  getShiftForSchedule: getShiftForSchedule,
  dayShiftDistribution: dayShiftDistribution,
  getScheduleForShift: getScheduleForShift,
  SCHEDULE: SCHEDULE,
  SHIFT: SHIFT
}
