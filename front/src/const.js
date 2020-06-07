export default {
  USER_TYPE: {SUPERADMIN: 'SUPERADMIN',
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
  USER_TYPE_READABLE: {
    SUPERADMIN: 'Superadmin',
    // Supervisor linea
    SUPERVISOR_PRODUCCION: 'Supervisor de producción',
    SUPERVISOR_MANTENIMIENTO: 'Supervisor de mantenimiento',
    SUPERVISOR_PANOL: 'Supervisor de pañol',
    // Supervisor de sector
    SUPERVISOR: 'Supervisor',
    // Supervisor de higiene y seguridad
    HIGIENE_SEGURIDAD: 'Higiene y Seguridad',
    JEFE_PLANTA: 'Jefe de Planta',
    JEFE_LINEA: 'Jefe de Linea',
    JEFE_SECTOR: 'Jefe de Sector',
    COLABORADOR: 'Colaborador',
    PANOL: 'Pañol',
    PERSONAL: 'Personal',
    JEFE_PERSONAL: 'Jefe de Personal',
    // Nacho's user
    RRHH: 'RRHH',
    OFICINA_TECNICA: 'Oficina Técnica',
    JEFE_MANTENIMIENTO: 'Jefe de Mantenimiento'
  },
  ROLES: {
    SUPERADMIN: 'SUPERADMIN',
    // Supervisor linea
    SUPERVISOR_PRODUCCION: 'SUPERVISOR_PRODUCCION',
    SUPERVISOR_MANTENIMIENTO: 'SUPERVISOR_MANTENIMIENTO',
    SUPERVISOR_PANOL: 'SUPERVISOR_PANOL',
    // Supervisor de sector
    SUPERVISOR: 'SUPERVISOR',
    // Supervisor de higiene y seguridad
    HIGIENE_SEGURIDAD: 'HIGIENE_SEGURIDAD',
    JEFE_PLANTA: 'JEFE_PLANTA',
    JEFE_LINEA: 'JEFE_LINEA',
    JEFE_SECTOR: 'JEFE_SECTOR',
    COLABORADOR: 'COLABORADOR',
    PANOL: 'PANOL',
    JEFE_PERSONAL: 'JEFE_PERSONAL',
    PERSONAL: 'PERSONAL',
    // Nacho's user
    RRHH: 'RRHH',
    OFICINA_TECNICA: 'OFICINA_TECNICA',
    JEFE_MANTENIMIENTO: 'JEFE_MANTENIMIENTO',
    SUPERVISORES: ['SUPERVISOR', 'SUPERVISOR_MANTENIMIENTO', 'SUPERVISOR_PRODUCCION', 'SUPERVISOR_PANOL'].join('|'),
    ADMINISTRACION: ['PERSONAL', 'RRHH', 'JEFE_PERSONAL'].join('|'),
    JEFES: ['JEFE_LINEA', 'JEFE_PLANTA', 'JEFE_MANTENIMIENTO', 'JEFE_SECTOR', 'JEFE_PERSONAL'].join('|'),
    SECTOR_PANOL: ['PANOL', 'SUPERVISOR_PANOL'].join('|')
  },
  shift: {
    T1: 'T1',
    T2: 'T2',
    T3: 'T3',
    T4: 'T4',
    D67: 'D67',
    D68: 'D68'
  },

  lines: {
    L1: 'Linea 1',
    L2: 'Linea 2'
  },

  sector: {
    'Apiladora': 'Apiladora',
    'Desapiladora': 'Desapiladora',
    'Extrusora': 'Extrusora',
    'Fabrica': 'Fabrica',
    'Laboratorio': 'Laboratorio',
    'Linea de Produccion': 'Linea de Produccion',
    'Mant Mecanico': 'Mant Mecanico',
    'Mant vagoneta': 'Mant vagoneta',
    'Mant. Automotor': 'Mant. Automotor',
    'Mant. Electrico': 'Mant. Electrico',
    'Mant. Electrónico': 'Mant. Electrónico',
    'Mant Edilicio': 'Mant Edilicio',
    'Mantenimiento Grl.': 'Mantenimiento Grl.',
    'Matriceria': 'Matriceria',
    'Of tecnica': 'Of tecnica',
    'Pañol': 'Pañol',
    'Playa': 'Playa',
    'Preparacion de tierra': 'Preparacion de tierra'
  },

  area: {
    MANTENIMIENTO: 'Mantenimiento',
    OFICINA_TECNICA: 'Oficina Tecnica',
    'PAÑOL': 'Pañol',
    PLAYA: 'Playa',
    PRODUCCION: 'Producción'
  },

  position: {
    'Ayudante': 'Ayudante',
    'Oficial': 'Oficial',
    'De turno': 'De turno',
    'Supervisor de linea': 'Supervisor de linea',
    'Supervisor de turno': 'Supervisor de turno',
    'Chofer de autoelevador': 'Chofer de autoelevador',
    'Soldador': 'Soldador',
    'Asistente': 'Asistente',
    'Supervisor mecánico': 'Supervisor mecánico'
  },

  request_types: {
    EPP: 'EPP',
    NEWS: 'NEWS',
    CHECKLIST_GENERAL_OBSERVATION: 'CHECKLIST_GENERAL_OBSERVATION',
    CHECKLIST_OBSERVATION: 'CHECKLIST_OBSERVATION',
    CHECKLIST_CHECK: 'CHECKLIST_CHECK'
  },

  states: {
    COMPLETED: 'COMPLETED',
    PENDING: 'PENDING',
    ERROR: 'ERROR'
  },

  staff_action_types: {
    STAFF_REQUEST: 'StaffRequest',
    STAFF_NEWS: 'StaffNews'
  },

  news_types: {
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    EARLY: 'EARLY',
    ACCIDENT: 'ACCIDENT',
    OBSERVATION: 'OBSERVATION',
    HOLIDAYS: 'HOLIDAYS'
  },

  news_types_text: {
    ABSENT: 'FALTA',
    LATE: 'LLEGADA TARDE',
    EARLY: 'SALIDA TEMPRANA',
    ACCIDENT: 'ACCIDENTE',
    REPORT_SICK: 'SE REPORTA ENFERMO',
    MEDICAL_ORDER: 'RETIRO DE ORDEN MEDICA',
    MEDICAL_REPORT: 'ENTREGA DE INFORME MÉDICO',
    BIRTH_LICENSE: 'LICENCIA POR NACIMIENTO',
    SINDICAL_LICENSE: 'LICENCIA DE SINDICATO',
    DEATH_LICENSE: 'LICENCIA DE DEFUNCIÓN',
    UNION_LICENSE: 'LICENCIA DE MATRIMONIO',
    MEDICAL_LICENSE: 'LICENCIA MÉDICA',
    OBSERVATION: 'OBSERVACIÓN',
    HOLIDAYS: 'VACACIONES',
    EXTRAORDINARY: 'LICENCIA EXTRAORDINARIA',
    COVID19: 'LICENCIA COVID19'
  },

  schedule: [
    {
      value: 'MANIANA',
      begins: 6,
      ends: 14
    },
    {
      value: 'TARDE',
      begins: 14,
      ends: 22
    },
    {
      value: 'NOCHE',
      begins: 22,
      ends: 6
    }
  ],

  event_types: {
    LICENSE: 'LICENSE',
    MEDICAL_REPORT: 'MEDICAL_REPORT',
    MEDICAL_ORDER: 'MEDICAL_ORDER',
    BIRTH_LICENSE: 'BIRTH_LICENSE',
    SINDICAL_LICENSE: 'SINDICAL_LICENSE',
    DEATH_LICENSE: 'DEATH_LICENSE',
    UNION_LICENSE: 'UNION_LICENSE',
    MEDICAL_LICENSE: 'MEDICAL_LICENSE',
    HOLIDAYS: 'HOLIDAYS',
    EXTRAORDINARY: 'EXTRAORDINARY',
    COVID19: 'COVID19'
  },

  medical_types: {
    ACCIDENT: 'ACCIDENT',
    OTHER: 'OTHER'
  },

  currentSchedule () {
    const currentHours = new Date().getHours()
    return this.schedule.find(e => {
      return (e.begins <= currentHours &&
        currentHours < e.ends) ||
        e.begins > e.ends
    })
  },

  formErrorMsg: {
    required: () => 'Campo Obligatorio.',
    maxLength: (params) => `${params.max} caracteres como máximo.`,
    minLength: (params) => `${params.min} caracteres como minimo.`,
    numeric: () => 'Sólo caracteres numéricos.',
    fixedLength: () => 'Longitud no válida.',
    alpha: () => 'Sólo caracteres alfabéticos.',
    isUnique: () => 'Ya existe',
    email: () => 'El email ingresado no es válido'
  },

  spinner: {
    speed: 0.4
  },

  toast_types: {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    INFO: 'INFO',
    WARNING: 'WARNING'
  },
  staff_requests_types: {
    SHIFT_CHANGE: 'SHIFT_CHANGE',
    EXTRA_HOURS: 'EXTRA_HOURS',
    LEAVE: 'LEAVE',
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    EARLY: 'EARLY'
  },
  staff_requests_types_readable: {
    SHIFT_CHANGE: 'Cambio de Turno',
    EXTRA_HOURS: 'Horas extras',
    LEAVE: 'Permiso de'
  },
  request_status_types: {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    PENDING: 'PENDING'
  },
  FORMAT_DATE: 'DD/MM/YYYY',
  FORMAT_DATETIME: 'DD/MM/YYYY HH:mm',
  LEAVE_REQUEST_TYPE_READABLE: {
    ABSENT: 'Falta',
    LATE: 'Llegada Tarde',
    EARLY: 'Salida'
  },
  LEAVE_REQUEST_TYPE: {
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    EARLY: 'EARLY'
  },
  STAFF_REQUEST_STATE: {
    PENDING_APPROVAL: 0,
    APPROVED: 1,
    REJECTED: 2,
    ARCHIVED: 3
  },

  MEETING_STATE: {
    PROGRAMMED: 0,
    EXECUTED: 1,
    DONE: 2,
    UNREALIZED: 3,
    REPROGRAMED: 4
  },

  STAFF_REQUEST_STATE_READABLE: {
    0: 'Pendiente',
    1: 'Aprobada',
    2: 'Rechazada',
    3: 'Archivada'
  },

  MEETING_STATE_READABLE: {
    0: 'Programada',
    1: 'Ejecutada',
    2: 'Realizada',
    3: 'No Realizada',
    4: 'Re-Programada'
  },

  staff_requests_types_uri: {
    SHIFT_CHANGE: 'shift-change',
    EXTRA_HOURS: 'extra-hours',
    LEAVE: 'leave',
    ABSENT: 'leave',
    LATE: 'leave',
    EARLY: 'leave'
  },
  SERVER_ERROR: {
    IDEMPOTENCY_KEY_DUPLICATE: 1001,
    STAFF_REQUEST_TIME_LIMITATION: 1002,
    STAFF_REQUEST_ALREADY_APPROVED: 1003,
    STAFF_REQUEST_CANT_BE_ARCHIVED: 1004
  },
  LEAVE_RESOLUTION: {
    COMPENSATE: 'COMPENSATE',
    NO_COMPENSATE: 'NO_COMPENSATE',
    DAY_OFF: 'DAY_OFF',
    NO_DEDUCT: 'NO_DEDUCT'
  },
  LEAVE_RESOLUTION_READABLE: {
    COMPENSATE: 'Compensa',
    NO_COMPENSATE: 'No compensa',
    DAY_OFF: 'Franco',
    NO_DEDUCT: 'No descuenta'
  },
  AVAILABILITY_WIDGET_TYPES: {
    STAFF_NEWS_ABSENT: 'AUSENTE',
    STAFF_NEWS_LATE: 'LLEGADA TARDE',
    STAFF_NEWS_EARLY: 'SALIDA TEMPRANA',
    STAFF_NEWS_ACCIDENT: 'ACCIDENTE',
    LEAVE_REQUEST_ABSENT: 'FALTA PROGRAMADA',
    LEAVE_REQUEST_LATE: 'INGRESO PROGRAMADO',
    LEAVE_REQUEST_EARLY: 'SALIDA PROGRAMADA',
    LEAVE_REQUEST_ACCIDENT: 'ACCIDENTE',
    STAFF_NEWS_REPORT_SICK: 'SE REPORTA ENFERMO',
    STAFF_NEWS_MEDICAL_ORDER: 'RETIRO DE ORDEN MEDICA',
    STAFF_NEWS_MEDICAL_REPORT: 'ENTREGA DE INFORME MÉDICO',
    BIRTH_LICENSE: 'LICENCIA POR NACIMIENTO',
    SINDICAL_LICENSE: 'LICENCIA DE SINDICATO',
    DEATH_LICENSE: 'LICENCIA DE DEFUNCIÓN',
    UNION_LICENSE: 'LICENCIA DE MATRIMONIO',
    STAFF_NEWS_MEDICAL_LICENSE: 'LICENCIA MÉDICA',
    STAFF_NEWS_OBSERVATION: 'OBSERVACIÓN',
    COMPENSATE: 'COMPENSACION',
    STAFF_REQUEST_SHIFT_CHANGE: 'CAMBIO PROGRAMADO',
    STAFF_REQUEST_EXTRA_HOURS: 'HORAS EXTRAS',
    STAFF_REQUEST_LEAVE: 'SE RETIRA',
    MEDICAL_ORDER: 'Orden medica',
    EXTRA_HOURS: 'Horas extras',
    SHIFT_CHANGE: 'Cambio de turno',
    MEDICAL_REPORT: 'Informe medico',
    SUSPENSION: 'SUSPENSION',
    HOLIDAYS: 'Vacaciones',
    EXTRAORDINARY: 'LICENCIA EXTRAORDINARIA',
    COVID19: 'LICENCIA COVID19'
  },
  SANCTION_TYPE: {
    SUSPENSION: 'SUSPENSION',
    WARNING: 'WARNING'
  },
  SANCTION_TYPE_READABLE: {
    SUSPENSION: 'Suspensión',
    WARNING: 'Apercibimiento'
  },
  SANCTIONS_TYPE_MSG: {
    WARNING_HEADER: 'Se notifica a Ud. que se ha resuelto aplicarle un apercibimiento disciplinario en razón de haber',
    WARNING_FOOTER: 'De repetirse estos hechos, se aplicarán medidas más rigurosas que faculta la ley.',
    SUSPENSION_HEADER: 'Se notifica a Ud. que atento de haber',
    SUSPENSION_FOOTER: 'Ha sido suspendido de sus tareas'
  },
  RECOMMENDATION_TYPE: {
    OPERATIVE: 'OPERATIVE',
    SAFETY: 'SAFETY',
    DISCIPLINE: 'DISCIPLINE'
  },
  OCCURRENCE_TYPE_READABLE: {
    OPERATIVE: 'Operativa',
    SAFETY: 'Seguridad',
    DISCIPLINE: 'Disciplina',
    TRAINING: 'Capacitación'
  },
  OCCURRENCE_STATE_READABLE: {
    PENDING_RESOLUTION: 'Pendiente de resolución',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
    CANCELED: 'Anulada'
  },
  OCCURRENCE_STATE: {
    PENDING_RESOLUTION: 'PENDING_RESOLUTION',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    CANCELED: 'CANCELED'
  },
  MEETING_NAME: {
    T1L1: 'T1-L1',
    T1L2: 'T1-L2',
    T2L1: 'T2-L1',
    T2L2: 'T2-L2',
    T3L1: 'T3-L1',
    T3L2: 'T3-L2',
    T4L1: 'T4-L1',
    T4L2: 'T4-L2',
    SUPERVISORES: 'Supervisores',
    PRODUCCION: 'Producción',
    EXTRUSORA: 'EXTRUSORA',
    APILADORA: 'APILADORA',
    DESAPILADORA: 'DESAPILADORA',
    ACOPIO_TIERRA: 'Acopio de tierra',
    PREPARACION_TIERRA: 'Preparacion de tierra',
    MANT_MECANICO: 'Mant. Mecanico',
    MANT_VAGONETA: 'Mant. vagoneta',
    MANT_AUTOMOTOR: 'Mant. Automotor',
    MANT_ELECTRICO: 'Mant. Electrico',
    MANT_ELECTRONICO: 'Mant. Electrónico',
    MANT_EDILICIO: 'Mant. Edilicio',
    MANT_GENERAL: 'Mantenimiento Grl.',
    MANT_TECNICA: 'Técnica de Mant.',
    PAÑOL: 'Pañol',
    PLAYA: 'Playa',
    COMPRAS: 'Compras',
    RRHH: 'RRHH/Personal',
    SEGURIDAD_HIGIENE: 'Seguridad e Higiene'
  },
  MEETING_TYPE_READABLE: {
    INDIVIDUAL: 'Individual',
    FRECUENCY: 'Predeterminada',
    SIMPLE: 'Extraordinaria',
    GROUP: 'Diaria de Producción',
    MONTHLY: 'Mensual del Turno/Sector',
    TRAINING: 'Capacitación'
  },
  MEETING_TYPE_CREATABLE: {
    INDIVIDUAL: 'Individual',
    FRECUENCY: 'Predeterminada',
    SIMPLE: 'Extraordinaria'
  },
  MEETING_FRECUENCY: {
    DAILY: 'Diaria',
    MONTHLY: 'Mensual',
    WEEKLY: 'Semanal'
  },
  WEEKLY_MEETING_FRECUENCY: {
    MONDAY: 'Lunes',
    FRIDAY: 'Viernes',
    TUESDAY: 'Martes',
    SATURDAY: 'Sábado',
    WEDNESDAY: 'Miércoles',
    SUNDAY: 'Domingo',
    THURSDAY: 'Jueves'
  },
  RECOMMENDATION_MEETING_READABLE: {
    OPERATIVE: 'Operativa',
    SAFETY: 'Seguridad',
    DISCIPLINE: 'Disciplina',
    TRAINING: 'Capacitación'
  },
  FABRIC_ATTRIBUTE: {
    area: 'Área',
    position: 'Puesto',
    sector: 'Sector',
    shift: 'Turno',
    line: 'Linea'
  },
  PROTECTED_SHIFT: {
    T1: 'T1 (10)',
    T2: 'T2 (11)',
    T3: 'T3 (12)',
    T4: 'T4 (13)'
  }
}
