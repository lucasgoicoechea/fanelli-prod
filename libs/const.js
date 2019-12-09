const path = require('path')
const constants = {
  USER_TYPE: {
    SUPERADMIN: 'SUPERADMIN',
    // Supervisor linea
    SUPERVISOR_PRODUCCION: 'SUPERVISOR_PRODUCCION',
    SUPERVISOR_MANTENIMIENTO: 'SUPERVISOR_MANTENIMIENTO',
    SUPERVISOR_PANOL: 'SUPERVISOR_PANOL',
    // Supervisor de sector
    SUPERVISOR: 'SUPERVISOR',
    PERSONAL: 'PERSONAL',
    // Supervisor de higiene y seguridad
    HIGIENE_SEGURIDAD: 'HIGIENE_SEGURIDAD',
    JEFE_PLANTA: 'JEFE_PLANTA',
    JEFE_LINEA: 'JEFE_LINEA',
    JEFE_SECTOR: 'JEFE_SECTOR',
    JEFE_PERSONAL: 'JEFE_PERSONAL',
    COLABORADOR: 'COLABORADOR',
    PANOL: 'PANOL',
    // Nacho's user
    RRHH: 'RRHH',
    OFICINA_TECNICA: 'OFICINA_TECNICA',
    JEFE_MANTENIMIENTO: 'JEFE_MANTENIMIENTO'
  },

  AREA: {
    PRODUCCION: 'PRODUCCION',
    MANTENIMIENTO: 'MANTENIMIENTO',
    PANIOL: 'PAÑOL',
    OFICINATECNICA: 'OFICINA_TECNICA',
    PLAYA: 'PLAYA',
    VAGONETA: 'VAGONETA',
    SOLDADOR: 'SOLDADOR'
  },

  NOTIFICATION_TYPE: {
    DEFAULT: 'DEFAULT',
    ACCIDENTE: 'ACCIDENTE',
    NOVEDAD: 'NOVEDAD',
    AUSENCIA: 'AUSENCIA',
    ENFERMO: 'ENFERMO',
    EPP: 'EPP',
    RECORDATORIO_CHECKLIST: 'RECORDATORIO_CHECKLIST',
    TARDE: 'TARDE',
    VACACIONES: 'VACACIONES',
    CUMPLE: 'CUMPLE',
    SHIFT_CHANGE: 'SHIFT_CHANGE',
    EXTRA_HOURS: 'EXTRA_HOURS',
    LEAVE: 'LEAVE',
    STAFF_REQUEST: 'STAFF_REQUEST',
    OCCURRENCE: 'OCCURRENCE'
  },

  SHIFTS: ['T1', 'T2', 'T3', 'T4', 'D67', 'D68'],

  LINES: ['L1', 'L2'],

  COLOURS: {
    CASCO: ['Amarillo', 'Azul', 'Verde', 'Naranja', 'Rojo', 'Blanco'],
    PANTALONES: ['Azul', 'Marron', 'Naranja'],
    CAMISA: ['Azul', 'Marron', 'Naranja']
  },
  SIZES: {
    BOTINES: ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
    PANTALONES: ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64'],
    CAMISA: ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'],
    REMERA: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    MAMELUCO: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  },

  CHECKS_SECTOR: {
    EXTRUSORA: 'EXTRUSORA',
    APILADORA: 'APILADORA',
    DESAPILADORA: 'DESAPILADORA'
  },

  STAFF_NEWS_TYPE: {
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    EARLY: 'EARLY',
    OBSERVATION: 'OBSERVATION',
    ACCIDENT: 'ACCIDENT'
  },

  LICENSE_TYPE: {
    ABSENT: 'ABSENT',
    MEDICAL_REPORT: 'MEDICAL_REPORT',
    MEDICAL_ORDER: 'MEDICAL_ORDER',
    BIRTH_LICENSE: 'BIRTH_LICENSE',
    DEATH_LICENSE: 'DEATH_LICENSE',
    UNION_LICENSE: 'UNION_LICENSE',
    MEDICAL_LICENSE: 'MEDICAL_LICENSE',
    SINDICAL_LICENSE: 'SINDICAL_LICENSE',
    HOLIDAYS: 'HOLIDAYS'
  },

  STAFF_REQUEST_TYPE: {
    LEAVE: 'LEAVE',
    EXTRA_HOURS: 'EXTRA_HOURS',
    SHIFT_CHANGE: 'SHIFT_CHANGE'
  },

  STAFF_REQUEST_MEDICAL_TYPE:
    {
      ACCIDENT: 'ACCIDENT',
      MEDICAL: 'MEDICAL',
      ABSENT: 'ABSENT'
    },

  SHIFT_DURATION_MS: 8 * 60 * 60 * 1000,
  ONE_HOUR_MS: 1000 * 60 * 60,

  SCHEDULE: {
    MANIANA: {
      value: 'MANIANA',
      begins: 6,
      ends: 14,
      readable: 'Mañana',
      beginsAsDate: () => {
        const date = new Date()
        date.setHours(6, 0, 0, 0)
        return date
      },
      endsAsDate: () => {
        const date = new Date()
        date.setHours(14, 0, 0, 0)
        return date
      }
    },
    TARDE: {
      value: 'TARDE',
      begins: 14,
      ends: 22,
      readable: 'Tarde',
      beginsAsDate: () => {
        const date = new Date()
        date.setHours(14, 0, 0, 0)
        return date
      },
      endsAsDate: () => {
        const date = new Date()
        date.setHours(22, 0, 0, 0)
        return date
      }
    },
    NOCHE: {
      value: 'NOCHE',
      begins: 22,
      ends: 6,
      readable: 'Noche',
      beginsAsDate: () => {
        const date = new Date()
        if (date.getHours() < 6) {
          date.setDate(date.getDate() - 1)
        }
        date.setHours(22, 0, 0, 0)
        return date
      },
      endsAsDate: () => {
        const date = new Date()
        date.setHours(6, 0, 0, 0)
        return date
      }
    },
    SIN_TURNO: {
      value: 'SIN_TURNO',
      begins: 8,
      ends: 16,
      beginsAsDate: () => {
        const date = new Date()
        date.setHours(8, 0, 0, 0)
        return date
      },
      endsAsDate: () => {
        const date = new Date()
        date.setHours(16, 0, 0, 0)
        return date
      }
    },
    FRANCO: {
      value: 'FRANCO',
      readable: 'Franco'
    }
  },

  PROTECTED_SHIFT: {
    T1: 'T1 (10)',
    T2: 'T2 (11)',
    T3: 'T3 (12)',
    T4: 'T4 (13)'
  },

  LEAVE_REQUEST_TYPE: {
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    EARLY: 'EARLY'
  },

  ERROR: {
    IDEMPOTENCY_KEY_DUPLICATE: 1001,
    STAFF_REQUEST_TIME_LIMITATION: 1002,
    STAFF_REQUEST_ALREADY_APPROVED: 1003,
    STAFF_REQUEST_CANT_BE_ARCHIVED: 1004,
    STAFF_REQUEST_CANT_BE_CANCELED: 1005,
    DOCUMENT_CANT_BE_EDITED: 1006,
    DOCUMENT_CANT_BE_REMOVED: 1007,
    DOCUMENT_CANT_BE_CREATED: 1008,
    CYCLIC_RESPONSIBLE: 1009
  },

  STAFF_REQUEST_STATE: {
    PENDING_APPROVAL: 0,
    APPROVED: 1,
    REJECTED: 2
  },

  LEAVE_RESOLUTION: {
    COMPENSATE: 'COMPENSATE',
    NO_COMPENSATE: 'NO_COMPENSATE',
    DAY_OFF: 'DAY_OFF',
    NO_DEDUCT: 'NO_DEDUCT'
  },
  PDF_IMAGES_PATH: path.join(__dirname, '../images/'),

  AVAILABILITY_TYPE: {
    STAFF_NEWS_EARLY: 'STAFF_NEWS_EARLY',
    STAFF_NEWS_ABSENT: 'STAFF_NEWS_ABSENT',
    STAFF_NEWS_LATE: 'STAFF_NEWS_LATE',
    STAFF_NEWS_ACCIDENT: 'STAFF_NEWS_ACCIDENT',
    LEAVE_REQUEST_EARLY: 'LEAVE_REQUEST_EARLY',
    LEAVE_REQUEST_ABSENT: 'LEAVE_REQUEST_ABSENT',
    LEAVE_REQUEST_LATE: 'LEAVE_REQUEST_LATE',
    EXTRA_HOURS: 'EXTRA_HOURS',
    COMPENSATE: 'COMPENSATE',
    MEDICAL_REPORT: 'MEDICAL_REPORT',
    MEDICAL_ORDER: 'MEDICAL_ORDER',
    BIRTH_LICENSE: 'BIRTH_LICENSE',
    DEATH_LICENSE: 'DEATH_LICENSE',
    UNION_LICENSE: 'UNION_LICENSE',
    SINDICAL_LICENSE: 'SINDICAL_LICENSE',
    SHIFT_CHANGE: 'SHIFT_CHANGE',
    SUSPENSION: 'SUSPENSION'
  },
  SANCTION_TYPE: {
    WARNING: 'WARNING',
    SUSPENSION: 'SUSPENSION'
  },
  RECOMMENDATION_TYPE: {
    OPERATIVE: 'OPERATIVE',
    SAFETY: 'SAFETY',
    DISCIPLINE: 'DISCIPLINE'
  },
  RECOMMENDATION_MEETING: {
    OPERATIVE: 'OPERATIVE',
    SAFETY: 'SAFETY',
    DISCIPLINE: 'DISCIPLINE',
    MONTHLY: 'MONTHLY'
  },
  READABLE_RECOMMENDATION_MEETING: {
    OPERATIVE: 'operativa',
    SAFETY: 'seguridad',
    DISCIPLINE: 'disciplina',
    /* TODO create migration to replace MONTHLY recommendation meeting */
    MONTHLY: 'mensual del sector'
  },
  OCCURRENCE_STATE: {
    PENDING_RESOLUTION: 'PENDING_RESOLUTION',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELED: 'CANCELED'
  },
  LICENSE_TYPES_READABLE: {
    BIRTH_LICENSE: 'Licencia por Nacimiento',
    SINDICAL_LICENSE: 'Licencia de Sindicato',
    DEATH_LICENSE: 'Licencia de Defunción',
    UNION_LICENSE: 'Licencia de Matromonio',
    HOLIDAYS: 'Vacaciones',
    MEDICAL_LICENSE: 'Carpeta Medica'
  },
  OCCURRENCE_RECOMENDATION_READABLE: {
    OPERATIVE: 'Operativa',
    SAFETY: 'Seguridad',
    DISCIPLINE: 'Disciplina'
  },
  MEETING_TYPE: {
    INDIVIDUAL: 'INDIVIDUAL',
    GROUP: 'GROUP',
    MONTHLY: 'MONTHLY',
    TRAINING: 'TRAINING'
  },
  READABLE_MEETING_TYPE: {
    INDIVIDUAL: 'individual',
    GROUP: 'grupo',
    MONTHLY: 'mensual',
    TRAINING: 'capacitación'
  }
}
constants.ROLE = {
  SUPERVISORES: [constants.USER_TYPE.SUPERVISOR, constants.USER_TYPE.SUPERVISOR_MANTENIMIENTO, constants.USER_TYPE.SUPERVISOR_PRODUCCION, constants.USER_TYPE.SUPERVISOR_PANOL],
  ADMINISTRACION: [constants.USER_TYPE.PERSONAL, constants.USER_TYPE.RRHH, constants.USER_TYPE.JEFE_PERSONAL],
  JEFES: [constants.USER_TYPE.JEFE_LINEA, constants.USER_TYPE.JEFE_PLANTA, constants.USER_TYPE.JEFE_MANTENIMIENTO, constants.USER_TYPE.JEFE_SECTOR, constants.USER_TYPE.JEFE_PERSONAL],
  SECTOR_PANOL: [constants.USER_TYPE.PANOL, constants.USER_TYPE.SUPERVISOR_PANOL]
}
Object.assign(constants.ROLE, constants.USER_TYPE)
module.exports = constants
