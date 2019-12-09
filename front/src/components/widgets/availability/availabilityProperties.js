import dateAndTime from '@/utils/dateAndTime'
import Constant from '@/const.js'

const typeColor = {
  'STAFF_NEWS_ABSENT': '#ff0000',
  'COMPENSATE': '#00897B',
  'STAFF_NEWS_EARLY': '#ef6c00',
  'STAFF_NEWS_LATE': '#ef6c00',
  'STAFF_NEWS_ACCIDENT': '#ff0000',
  'LEAVE_REQUEST_ABSENT': '#d81b60',
  'LEAVE_REQUEST_LATE': '#923518',
  'LEAVE_REQUEST_EARLY': '#388E3C',
  'MEDICAL_ORDER': '#ff0000',
  'MEDICAL_REPORT': '#ff1a38',
  'EXTRA_HOURS': '#2e7d32',
  'SHIFT_CHANGE': '#558b2f',
  'SINDICAL_LICENSE': '#3219ee',
  'DEATH_LICENSE': '#3219ee',
  'UNION_LICENSE': '#3219ee',
  'BIRTH_LICENSE': '#3219ee',
  'SUSPENSION': '#ab141e',
  'HOLIDAYS': '#ffa56d'
}

const typeMsg = {
  'STAFF_NEWS_LATE': (params) => {
    return `LLegada tarde 
      ${(params.request.withNotice) ? 'con aviso' : 'sin aviso'}. 
      Llega a las ${params.time.from}. `
  },
  'STAFF_NEWS_ABSENT': (params) => {
    return `Ausente
      ${(params.request.withNotice) ? 'con aviso' : 'sin aviso'}.`
  },
  'STAFF_NEWS_EARLY': (params) => {
    return `Se retirna
      ${(params.request.withNotice) ? 'con aviso' : 'sin aviso'}.
      Se retira a las ${params.time.from}`
  },
  'STAFF_NEWS_ACCIDENT': (params) => {
    return `
      ${!(params.request.inPlant) ? 'Accidente In Itinere.' : 'El accidente ocurrio en la plata.'}
      ${(params.request.left) ? 'Se retira a las ' + params.request.time : 'Falta'}`
  },
  'LEAVE_REQUEST_ABSENT': (params) => {
    const resolution =
      Constant.LEAVE_RESOLUTION_READABLE[params.request.resolution]

    if (!(Constant.LEAVE_RESOLUTION.COMPENSATE === params.request.resolution)) {
      return `Falta programada. ${resolution}.`
    }

    if (params.request.daysToCompensate.length === 0) {
      return 'Falta programada. Compensará: no hay fecha seleccionada.'
    }

    const compensate = `Compensará
      ${((params.request.daysToCompensate.length === 1) ? 'el día' : 'los días')}`

    const dias = params.request.daysToCompensate
      .map(d => { return new Date(d.from) })
      .map(d => { return dateAndTime.dateDayAndMonth(d) })
      .join(', ')

    return `Falta programada. ${compensate} ${dias}`
  },
  'LEAVE_REQUEST_LATE': (params) => {
    return `Ingreso programado para las ${params.time.from}.`
  },
  'LEAVE_REQUEST_EARLY': (params) => {
    const msg = `Solicitud de salida temprana para las ${params.time.from}`
    if (params.time.hasOwnProperty('to') && params.time.to !== null) {
      return msg + ` Regresa a las ${params.time.to}`
    }
    return msg
  },
  'COMPENSATE': (params) => {
    return `Realiza compensanción de 
      ${Constant.LEAVE_REQUEST_TYPE_READABLE[params.request.type]}. 
      Compensa desde las ${params.time.from} hasta las ${params.time.to}`
  },
  'MEDICAL_ORDER': (params) => {
    return `Orden medica. 
      Turno médico el ${dateAndTime.dateDayAndMonth(params.request.medicalAppointment)}.`
  },
  'EXTRA_HOURS': (params) => {
    return `Horas Extras 
      desde ${params.time.from} 
      hasta ${params.time.to}.`
  },
  'SHIFT_CHANGE': (params) => {
    const temporary = (params.request.temporary) ? 'Temporal' : 'Permanente.'
    const byFabric = (params.request.byFabric) ? 'Solicitado por la fabrica' : ''
    const toShift = params.request.toShift.value
    return `Cambio ${temporary} a ${toShift}. ${byFabric}.`
  },
  'MEDICAL_REPORT': (params) => {
    let msg = ''
    if (params.request.medicalDischarge) {
      msg = `Alta médica el ${dateAndTime.dateDayAndMonth(params.request.dischargeDate)}.`
    } else {
      msg = `Próxima visita médica el ${dateAndTime.dateDayAndMonth(params.request.nextMedicalVisit)}.`
    }
    return `Informe médico. ${msg}`
  },
  'SINDICAL_LICENSE': (params) => {
    return `Licencia de sindicato
      desde ${dateAndTime.dateDayAndMonth(params.from)}
      hasta ${dateAndTime.dateDayAndMonth(params.to)}.`
  },
  'DEATH_LICENSE': (params) => {
    return `Licencia por defunción
      desde ${dateAndTime.dateDayAndMonth(params.from)}
      hasta ${dateAndTime.dateDayAndMonth(params.to)}.`
  },
  'UNION_LICENSE': (params) => {
    return `Licencia por matrimonio
      desde ${dateAndTime.dateDayAndMonth(params.from)}
      hasta ${dateAndTime.dateDayAndMonth(params.to)}.`
  },
  'BIRTH_LICENSE': (params) => {
    return `Licencia por nacimiento
      desde ${dateAndTime.dateDayAndMonth(params.from)}
      hasta ${dateAndTime.dateDayAndMonth(params.to)}.`
  },
  'SUSPENSION': (params) => {
    return `Suspensión
      desde ${dateAndTime.dateDayAndMonth(params.from)}
      hasta ${dateAndTime.dateDayAndMonth(params.to)}.`
  },
  'HOLIDAYS': (params) => {
    return `Vacaciones
      desde ${dateAndTime.dateDayAndMonth(params.from)}
      hasta ${dateAndTime.dateDayAndMonth(params.to)}.`
  }
}

export default {
  typeColor,
  typeMsg
}
