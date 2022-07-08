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
    // Oficial de sector
    OFICIAL_EXTRUSORA: 'OFICIAL_EXTRUSORA',
    OFICIAL_APILADORA: 'OFICIAL_APILADORA',
    OFICIAL_DESAPILADORA: 'OFICIAL_DESAPILADORA',
    OFICIAL_EXTRUSORA_L3: 'OFICIAL_EXTRUSORA_L3',
    OFICIAL_APILADORA_L3: 'OFICIAL_APILADORA_L3',
    OFICIAL_DESAPILADORA_L3: 'OFICIAL_DESAPILADORA_L3',
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
    RECORDATORIO_SUPERVISIONPART: 'RECORDATORIO_SUPERVISIONPART',
    TARDE: 'TARDE',
    VACACIONES: 'VACACIONES',
    CUMPLE: 'CUMPLE',
    SHIFT_CHANGE: 'SHIFT_CHANGE',
    EXTRA_HOURS: 'EXTRA_HOURS',
    LEAVE: 'LEAVE',
    STAFF_REQUEST: 'STAFF_REQUEST',
    OCCURRENCE: 'OCCURRENCE',
    MEETING: 'MEETING'
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

  SUPERVISION_PART_SECTOR: {
    EXTRUSORA: 'EXTRUSORA',
    APILADORA: 'APILADORA',
    DESAPILADORA: 'DESAPILADORA'
  },

  SUPERVISION_PART_MACHINE: {
    850: '850',
    750: '750',
    650: '650'
  },

  SUPERVISION_PART_MATERIAL: {
    MOLDE_8: '8',
    MOLDE_12_6A: '12-6A',
    MOLDE_12_8A: '12-9A',
    MOLDE_18: '18',
    MOLDE_P12: 'P12',
    MOLDE_P18: 'P18',
    MOLDE_L11: 'L11',
    MOLDE_C: 'C',
    MOLDE_DM20: 'DM20',
    MOLDE_DM24: 'DM24',
    MOLDE_DM27: 'DM27',
    MOLDE_DIN18: 'DIN18',
    MOLDE_DIN27: 'DIN27',
    MOLDE_COLUMNA: 'COLUMNA'
  },
  
  SUPERVISION_PART_UNIT_SECTOR: {
    EXTRUSORA: 'ESTANTERIA',
    APILADORA: 'VAGONETA',
    DESAPILADORA: 'VAGONETA'
  },

  SUPERVISION_PART_MACHINE_READBLE: {
    M850: '850',
    M750: '750',
    M650: '650'
  },

  SUPERVISION_PART_MATERIAL_FLOORS: {
    '8': 12,
    '12-6A': 12,
    '12-9A': 12,
    '18': 12,
    'P12': 11,
    'P18': 12,
    'L11': 9,
    'C': 12,
    'DM20': 12,
    'DM27': 12,
    'DM24': 12,
    'DM4': 12,
    'DIN18': 12,
    'DIN27': 12,
    'COLUMNA': 12
  },

  SUPERVISION_PART_MATERIAL_TONELADAS: {
    '8': 12,
    '12-6A': 12,
    '12-9A': 12,
    '18': 12,
    'P12': 11,
    'P18': 12,
    'L11': 9,
    'C': 12,
    'DM20': 12,
    'DM27': 12,
    'DM24': 12,
    'DM4': 12,
    'DIN18': 12,
    'DIN27': 12,
    'COLUMNA': 12
  },
  SUPERVISION_PART_LADRILLO_PALLET: {
    '8': 198,
    '12-6A': 144,
    '12-9A': 144,
    '18': 90,
    'P12': 126,
    'P18': 90,
    'L11': 80,
    'C': 90,
    'DM20': 90,
    'DM27': 90,
    'DM24': 90,
    'DM4': 120,
    'DIN18': 90,
    'DIN27': 90,
    'COLUMNA': 90
  },
  SUPERVISION_PART_LADRILLO_VAGON: {
    '8': 3168,
    '12-6A': 2304,
    '12-9A': 2304,
    '18': 1440,
    'P12': 1848,
    'P18': 1440,
    'L11': 1152,
    'C': 1440,
    'DM20': 1440,
    'DM27': 1440,
    'DM24': 1440,
    'DM4': 1920,
    'DIN18': 1440,
    'DIN27': 1440,
    'COLUMNA': 1440
  },
  SUPERVISION_PART_LADRILLO_CARRO: {
    '8': 720,
    '12-6A': 576,
    '12-9A': 576,
    '18': 384,
    'P12': 360,
    'P18': 360,
    'L11': 240,
    'C': 420,
    'DM20': 336,
    'DM27': 252,
    'DM24': 288,
    'DM4': 420,
    'DIN18': 384,
    'DIN27': 384,
    'COLUMNA': 420
  },
  SUPERVISION_PART_PESO_LADRILLO: {
    '8': 3.5,
    '12-6A': 4.5,
    '12-9A': 4.7,
    '18': 6.8,
    'P12': 5.6,
    'P18': 7.5,
    'L11': 6.6,
    'C': 6.535,
    'DM20': 7.5,
    'DM27': 7.5,
    'DM24': 7.5,
    'DM4': 5.7,
    'DIN18': 6.89,
    'DIN27': 6.89,
    'COLUMNA': 6.535
  },
  SUPERVISION_PART_INDEX_MATERIALS: {
    '8': 'total_MOLDE_8',
    '12-6A': 'total_MOLDE_12_6A',
    '12-9A': 'total_MOLDE_12_8A',
    '18': 'total_MOLDE_18',
    'P12': 'total_MOLDE_P12',
    'P18': 'total_MOLDE_P18',
    'L11': 'total_MOLDE_L11',
    'C': 'total_MOLDE_C',
    'DM20': 'total_MOLDE_DM20',
    'DM27': 'total_MOLDE_DM27',
    'DM24': 'total_MOLDE_DM24',
    'DM4': 'total_MOLDE_DM4',
    'DIN18': 'total_MOLDE_DIN18',
    'DIN27': 'total_MOLDE_DIN27',
    'COLUMNA': 'total_MOLDE_COLUMNA'
  },
  SUPERVISION_PART_MATERIALS: {
    '8': 1,
    '12-6A': 2,
    '12-9A': 3,
    '18': 4,
    'P12': 5,
    'P18': 6,
    'L11': 7,
    'C': 8,
    'DM20': 9,
    'DM27': 10,
    'DM24': 11,
    'DM4': 12,
    'DIN18': 13,
    'DIN27': 14,
    'COLUMNA': 15
  },

  SUPERVISION_PART_MATERIAL_READBLE: {
    MOLDE_8: '8',
    MOLDE_12_6A: '12-6A',
    MOLDE_12_8A: '12-9A',
    MOLDE_18: '18',
    MOLDE_P12: 'P12',
    MOLDE_P18: 'P18',
    MOLDE_L11: 'L11',
    MOLDE_C: 'C',
    MOLDE_DM4: 'DM4',
    MOLDE_DM20: 'DM20',
    MOLDE_DM24: 'DM24',
    MOLDE_DM27: 'DM27',
    MOLDE_DIN18: 'DIN18',
    MOLDE_DIN27: 'DIN27',
    MOLDE_COLUMNA: 'COLUMNA'
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
    HOLIDAYS: 'HOLIDAYS',
    EXTRAORDINARY: 'EXTRAORDINARY',
    COVID19: 'COVID19'
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

  MEETING_STATE: {
    PROGRAMMED: 0,
    EXECUTED: 1,
    DONE: 2,
    UNREALIZED: 3,
    REPROGRAMED: 4
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
    SUSPENSION: 'SUSPENSION',
    EXTRAORDINARY: 'EXTRAORDINARY',
    COVID19: 'COVID19'
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
    MONTHLY: 'MONTHLY',
    TRAINING: 'TRAINING'
  },
  READABLE_RECOMMENDATION_MEETING: {
    OPERATIVE: 'operativa',
    SAFETY: 'seguridad',
    DISCIPLINE: 'disciplina',
    /* TODO create migration to replace MONTHLY recommendation meeting */
    MONTHLY: 'mensual del sector',
    TRAINING: 'Capacitación'
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
    MEDICAL_LICENSE: 'Carpeta Medica',
    EXTRAORDINARY: 'Extraordinaria',
    COVID19: 'COVID19'
  },
  OCCURRENCE_RECOMENDATION_READABLE: {
    OPERATIVE: 'Operativa',
    SAFETY: 'Seguridad',
    DISCIPLINE: 'Disciplina',
    TRAINING: 'Capacitación'
  },
  MEETING_TYPE: {
    INDIVIDUAL: 'INDIVIDUAL',
    GROUP: 'GROUP',
    MONTHLY: 'MONTHLY',
    TRAINING: 'TRAINING',
    FRECUENCY: 'FRECUENCY',
    SIMPLE: 'SIMPLE'
  },
  READABLE_MEETING_TYPE: {
    INDIVIDUAL: 'INDIVIDUAL',
    GROUP: 'GROUP',
    MONTHLY: 'MONTHLY',
    TRAINING: 'TRAINING',
    FRECUENCY: 'FRECUENCY',
    SIMPLE: 'SIMPLE'
  },
  MEETING_MONTH_READBLE: {
    ENERO: 1,
    FEBRERO: 2,
    MARZO: 3,
    ABRIL: 4,
    MAYO: 5,
    JUNIO: 6,
    JULIO: 7,
    AGOSTO: 8,
    SEPTIEMBRE: 9,
    OCTUBRE: 10,
    NOVIEMBRE: 11,
    DICIEMBRE: 12
  },
  MEETING_FRECUENCY: {
    DAILY: 'Diaria',
    MONTHLY: 'Mensual',
    WEEKLY: 'Semanal'
  },
  WEEKLY_MEETING_FRECUENCY: {
    SUNDAY: 'Domingo',
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado'
  },
  WEEKLY_MEETING_FRECUENCY_DAY: {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
  }
}
constants.ROLE = {
  SUPERVISORES: [constants.USER_TYPE.SUPERVISOR, constants.USER_TYPE.SUPERVISOR_MANTENIMIENTO, constants.USER_TYPE.SUPERVISOR_PRODUCCION, constants.USER_TYPE.SUPERVISOR_PANOL],
  ADMINISTRACION: [constants.USER_TYPE.PERSONAL, constants.USER_TYPE.RRHH, constants.USER_TYPE.JEFE_PERSONAL],
  JEFES: [constants.USER_TYPE.JEFE_LINEA, constants.USER_TYPE.JEFE_PLANTA, constants.USER_TYPE.JEFE_MANTENIMIENTO, constants.USER_TYPE.JEFE_SECTOR, constants.USER_TYPE.JEFE_PERSONAL],
  SECTOR_PANOL: [constants.USER_TYPE.PANOL, constants.USER_TYPE.SUPERVISOR_PANOL],
  OFICIALES: [constants.USER_TYPE.OFICIAL_APILADORA, constants.USER_TYPE.OFICIAL_DESAPILADORA, constants.USER_TYPE.OFICIAL_EXTRUSORA]
}
Object.assign(constants.ROLE, constants.USER_TYPE)
module.exports = constants
