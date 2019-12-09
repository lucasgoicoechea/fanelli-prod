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
  }
}
