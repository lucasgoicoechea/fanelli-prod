import moment from 'moment'

export default {
  time24ToAMPM (time) {
    return moment(time, 'HH:mm').format('h:mm A')
  },
  dateWithTimeLong (date) {
    return moment(date).format('DD-MM-YYYY h:mm A')
  },
  dateDayAndMonth (date) {
    return moment(date).format('DD-MM-YYYY')
  },
  dateOnlyDayAndMonth (date) {
    return moment(date).format('DD-MM')
  },
  toTime24 (time) {
    return moment(time).format('HH:mm')
  },
  compareDate (date, date1) {
    var d1 = moment(date)
    var d2 = moment(date1)
    if (d1.year() > d2.year()) {
      return 1
    }
    if (d1.year() < d2.year()) {
      return -1
    }
    if (d1.month() > d2.month()) {
      return 1
    }
    if (d1.month() < d2.month()) {
      return -1
    }
    if (d1.date() > d2.date()) {
      return 1
    }
    if (d1.date() < d2.date()) {
      return -1
    }
    return 0
  }
}
