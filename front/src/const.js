export default {
  USER_TYPE: {SUPERADMIN: 'SUPERADMIN',
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
    // Oficial de sector
    OFICIAL_EXTRUSORA: 'Oficial Extrusora',
    OFICIAL_APILADORA: 'Oficial Apiladora',
    OFICIAL_DESAPILADORA: 'Oficial Desapiladora',
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
    // Oficial de sector
    OFICIAL_EXTRUSORA: 'OFICIAL_EXTRUSORA',
    OFICIAL_APILADORA: 'OFICIAL_APILADORA',
    OFICIAL_DESAPILADORA: 'OFICIAL_DESAPILADORA',
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
    OFICIALES: ['OFICIAL_EXTRUSORA', 'OFICIAL_APILADORA', 'OFICIAL_DESAPILADORA'].join('|'),
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
    L1: 'Linea 3',
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
    SUPERVISIONPART_GENERAL_OBSERVATION: 'SUPERVISIONPART_GENERAL_OBSERVATION',
    CHECKLIST_OBSERVATION: 'CHECKLIST_OBSERVATION',
    CHECKLIST_CHECK: 'CHECKLIST_CHECK',
    SUPERVISIONPART_HOUR: 'SUPERVISIONPART_HOUR'
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
    1: 'Vencida',
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
  MEETING_YEAR: {
    2017: 2017,
    2018: 2018,
    2019: 2019,
    2020: 2020,
    2021: 2021,
    2022: 2022
  },
  MEETING_MONTH: {
    ENERO: 'ENERO',
    FEBRERO: 'FEBRERO',
    MARZO: 'MARZO',
    ABRIL: 'ABRIL',
    MAYO: 'MAYO',
    JUNIO: 'JUNIO',
    JULIO: 'JULIO',
    AGOSTO: 'AGOSTO',
    SEPTIEMBRE: 'SEPTIEMBRE',
    OCTUBRE: 'OCTUBRE',
    NOVIEMBRE: 'NOVIEMBRE',
    DICIEMBRE: 'DICIEMBRE'
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
  SUPERVISION_PART_SECTOR: {
    EXTRUSORA: 'EXTRUSORA',
    APILADORA: 'APILADORA',
    DESAPILADORA: 'DESAPILADORA'
  },
  SUPERVISION_PART_UNIT_SECTOR: {
    EXTRUSORA: 'ESTANTERIA',
    APILADORA: 'VAGONETA',
    DESAPILADORA: 'VAGONETA'
  },
  SUPERVISION_PART_MACHINE: {
    M850: '850',
    M750: '750',
    M650: '650'
  },
  SUPERVISION_PART_MACHINE_READBLE: {
    850: 'M850',
    750: 'M750',
    650: 'M650'
  },
  SUPERVISION_PART_COUNT_APILADORA: {
    12: '12',
    11: '11',
    10: '10',
    9: '9',
    8: '8',
    7: '7',
    6: '6',
    5: '5',
    4: '4',
    3: '3',
    2: '2',
    1: '1',
    0: '0'
  },
  SUPERVISION_PART_COUNT_DESAPILADORA: {
    16: '16',
    15: '15',
    14: '14',
    13: '13',
    12: '12',
    11: '11',
    10: '10',
    9: '9',
    8: '8',
    7: '7',
    6: '6',
    5: '5',
    4: '4',
    3: '3',
    2: '2',
    1: '1',
    0: '0'
  },
  SUPERVISION_PART_UNIT_NYLON: {
    100: '100',
    101: '101',
    102: '102',
    103: '103',
    104: '104',
    105: '105',
    106: '106',
    107: '107',
    108: '108',
    109: '109',
    110: '110',
    111: '111',
    112: '112',
    113: '113',
    114: '114',
    115: '115'
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
    MOLDE_DM4: 'DM4',
    MOLDE_DM20: 'DM20',
    MOLDE_DM24: 'DM24',
    MOLDE_DM27: 'DM27',
    MOLDE_DIN18: 'DIN18',
    MOLDE_DIN27: 'DIN27',
    MOLDE_COLUMNA: 'COLUMNA'
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

  SUPERVISION_PART_MATERIAL_READBLE: {
    '8': 'MOLDE_8',
    '12-6A': 'MOLDE_12_6A',
    '12-9A': 'MOLDE_12_8A',
    '18': 'MOLDE_18',
    'P12': 'MOLDE_P12',
    'P18': 'MOLDE_P18',
    'L11': 'MOLDE_L11',
    'C': 'MOLDE_C',
    'DM20': 'MOLDE_DM20',
    'DM27': 'MOLDE_DM27',
    'DM24': 'MOLDE_DM24',
    'DM4': 'MOLDE_DM4',
    'DIN18': 'MOLDE_DIN18',
    'DIN27': 'MOLDE_DIN27',
    'COLUMNA': 'COLUMNA'
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
  },

  BUG_REPORT_LINES: {
    LINE_0: 'Linea 0',
    LINE_1: 'Linea 1',
    LINE_2: 'Linea 2',
    LINE_3: 'Linea 3'
  },

  BUG_REPORT_ESTADO: {
    SOLUCIONADO: 'Solucionado',
    SOLUCION_TEMPORAL: 'Solución Temporal',
    NO_SOLUCIONADO: 'No Solucionado'
  },

  BUG_REPORT_ESTADO_NO_SOLUCIONADO: {
    COMPLEJIDAD: 'Complejidad',
    PARADA: 'Parada',
    TIEMPO: 'Tiempo',
    PERSONAL: 'Personal',
    FALTA_CONOCIMIENTO: 'Falta de Conocimiento'
  },

  BUG_REPORT_PRIORIDAD2: {
    ALTO: 'Alto',
    MEDIO: 'Medio',
    BAJA: 'Baja'
  },
  BUG_REPORT_TURNOS: {
    T1: 'T1',
    T2: 'T2',
    T3: 'T3',
    T4: 'T4',
    ME: 'ME',
    MM: 'MM',
    JL: 'JL',
    OT: 'OT'
  },

// LINEA 2
// SECTOR PRODUCCION

  BUG_REPORT_SECTORS_LINE_2: {
    PRODUCCION: 'Producción',
    AUTOMATISMO_CORTE_Y_CARGA: 'Automatismo de Corte y Carga',
    SECADO: 'Secado',
    MOVIMENTACION_SECADERO: 'Movimentación de Secadero',
    APILADO: 'Apilado',
    HORNO: 'Horno',
    MOVIMENTACION_HORNO: 'Movimentación de Horno',
    DESAPILADO_Y_EMPAQUE: 'Desapilado y Empaque',
    SERVICIOS_AUXILIARES: 'Servicios Auxiliares'
  },

  BUG_REPORT_SUBSECTORS_PRODUCCION: {
    DOSIFICACION: 'Dosificación',
    EXTRUSION: 'Extrusión',
    LAMINADO: 'Laminado',
    MEZCLADO: 'Mezclado',
    TRANSPORTE: 'Transporte'
  },

  BUG_REPORT_TEAM_PRODUCCION_DOSIFICACION: {
    CAJON_ALIMENTADOR_1_PLANTA_3: 'Cajón Alimentador 1 Planta 3',
    DOSIFICADOR_6_PLANTA_2: 'Dosificador 6 Planta 2',
    DOSIFICADOR_8_PLANTA_2: 'Dosificador 8 Planta 2',
    DOSIFICADOR_4_PLANTA_2: 'Dosificador 4 Planta 2'
  },

  BUG_REPORT_GROUPS_PRODUCCION_DOSIFICACION: {
    MOTOR_MOTORRED_GIRO: 'Motor/Motorred Giro',
    MOTOR_MOTORRED_ASPAS: 'Motor/Motorred Aspas',
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda'
  },

  BUG_REPORT_TEAM_PRODUCCION_EXTRUSION: {
    DESMENUZADOR_DESCARTE_F2: 'Desmenuzador Descarte F2',
    EXTRUSORA_2_750_PLANTA_2: 'Extrusora 2 750 Planta 2',
    EXTRUSORA_3_850_PLANTA_2: 'Extrusora 3 850 Planta 2',
    VACIO_PLANTA_2: 'Vacio Planta 2',
    MEZCLADOR_13B_PLANTA_2: 'Mezclador 13B Planta 2',
    MEZCLADOR_BATEA_EXTERNA_2_750: 'Mezclador Batea Externa 2 750',
    MEZCLADOR_BATEA_EXTERNA_3_850: 'Mezclador Batea Externa 3 850'
  },

  BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_DESMENUZADOR_DESCARTE_F2: {
    MOTORRED: 'Motorred',
    ESTRUCTURA: 'Estructura'
  },

  BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_EXTRUSORA_2_750_PLANTA_2: {
    ESTRUCTURA: 'Estructura',
    MOTOR: 'Motor',
    REDUCTORA: 'Reductora',
    MOTORRED_ASPAS_DER: 'Motorred Aspas Derecha',
    MOTORRED_ASPAS_IZQ: 'Motorred Aspas Izquierda',
    ASPAS: 'Aspas'
  },

  BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_EXTRUSORA_3_850_PLANTA_2: {
    ESTRUCTURA: 'Estructura',
    MOTOR: 'Motor',
    REDUCTORA: 'Reductora',
    ASPAS: 'Aspas',
    MOTORRED_ASPAS: 'Motorred Aspas'
  },

  BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_VACIO_PLANTA_2: {
    BOMBA_1: 'Bomba 1',
    BOMBA_2: 'Bomba 2'
  },

  BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_MEZCLADORES_13_P2_BATEA_EXTERNA_2_750_BATEA_EXTERNA_3_850: {
    ESTRUCTURA: 'Estructura',
    MOTOR: 'Motor',
    REDUCTORA: 'Reductora'
  },

  BUG_REPORT_TEAM_PRODUCCION_LAMINADO: {
    LAMINADOR_PRIMARIO_LA9_PLANTA_2: 'Laminador Primario LA9 Planta 2',
    LAMINADOR_3_PLANTA_2: 'Laminador 3 Planta 2',
    LAMINADOR_7_PLANTA_2: 'Laminador 7 Planta 2',
    LAMINADOR_9_PLANTA_2: 'Laminador 9 Planta 2',
    LAMINADOR_PRIMARIO_BEDESCHI_1210_PLANTA_3: 'Laminador Primario Bedeschi 1210 Planta 3'
  },

  BUG_REPORT_GROUPS_PRODUCCION_LAMINADO: {
    LADO_LENTO: 'Lado Lento',
    LADO_VELOZ: 'Lado Veloz',
    ESTRUCTURA: 'Estructura'
  },

  BUG_REPORT_GROUPS_PRODUCCION_LAMINADO_LAMINADOR_PRIMARIO_BEDESCHI_1210_PLANTA_3: {
    LADO_LENTO: 'Lado Lento',
    LADO_VELOZ: 'Lado Veloz'
  },

  BUG_REPORT_PARTS_PRODUCCION_LAMINADO: {
    MOTOR: 'Motor',
    RODILLO: 'Rodillo'
  },

  BUG_REPORT_TEAM_PRODUCCION_MEZCLADO: {
    MEZCLADOR_FILTRO_BONGIOANNI_PLANTA_2: 'Mezclador Filtro Bongioanni Planta 2'
  },

  BUG_REPORT_GROUPS_PRODUCCION_MEZCLADO: {
    ESTRUCTURA: 'Estructura',
    MOTOR: 'Motor',
    REDUCTORA: 'Reductora'
  },

  BUG_REPORT_TEAM_PRODUCCION_TRANSPORTE: {
    CINTA_PLANTA_2: 'Cinta Planta 2',
    CINTA_2_PLANTA_2: 'Cinta 2 Planta 2',
    CINTA_2A_PLANTA_2: 'Cinta 2A Planta 2',
    CINTA_2C_PLANTA_2: 'Cinta 2C Planta 2',
    CINTA_2D_PLANTA_2: 'Cinta 2D Planta 2',
    CINTA_3_PLANTA_2: 'Cinta 3 Planta 2',
    CINTA_4_PLANTA_2: 'Cinta 4 Planta 2',
    CINTA_5_PLANTA_2: 'Cinta 5 Planta 2',
    CINTA_10_PLANTA_2: 'Cinta 10 Planta 2',
    CINTA_11_PLANTA_2: 'Cinta 11 Planta 2',
    CINTA_12_PLANTA_2: 'Cinta 12 Planta 2',
    CINTA_BYPASS_MIXER_PLANTA_2: 'Cinta By Pass Mixer Planta 2',
    CINTA_16_PLANTA_2: 'Cinta 16 Planta 2',
    CINTA_17_PLANTA_2: 'Cinta 17 Planta 2',
    CINTA_18_PLANTA_2: 'Cinta 18 Planta 2',
    CINTA_19_PLANTA_2: 'Cinta 19 Planta 2',
    CINTA_DESCARTE_VERDE_2_PLANTA_2: 'Cinta Descarte Verde 2 Planta 2',
    CINTA_DESCARTE_VERDE_3_PLANTA_2: 'Cinta Descarte Verde 3 Planta 2',
    CINTA_DESCARTE_VERDE_4_PLANTA_2: 'Cinta Descarte Verde 4 Planta 2',
    CINTA_DESCARTE_VERDE_5_PLANTA_2: 'Cinta Descarte Verde 5 Planta 2',
    CINTA_DESCARTE_VERDE_6_PLANTA_2: 'Cinta Descarte Verde 6 Planta 2',
    CINTA_DESCARTE_VERDE_7_PLANTA_2: 'Cinta Descarte Verde 7 Planta 2',
    CINTA_DESCARTE_VERDE_8_PLANTA_2: 'Cinta Descarte Verde 8 Planta 2',
    CINTA_DESCARTE_SECO_1_PLANTA_2: 'Cinta Descarte Seco 1 Planta 2',
    CINTA_DESCARTE_SECO_2_PLANTA_2: 'Cinta Descarte Seco 2 Planta 2',
    CINTA_DESCARTE_SECO: 'Cinta Descarte Seco',
    CINTA_DESCARTE_VERDE: 'Cinta Descarte Verde'
  },

  BUG_REPORT_GROUPS_PRODUCCION_TRANSPORTE: {
    MOTOR_MOTORRED: 'Motor/Motorred',
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda'
  },
  // SECTOR AUTOMATISMO CORTE Y CARGA
  BUG_REPORT_SUBSECTORS_AUTOMATISMO_CORTE_Y_CARGA: {
    CORTADORA: 'Cortadora',
    MESA_DE_TRANSPORTE: 'Mesa de Transporte',
    MECANISMO_DE_CARGA: 'Mecanismo de Carga'
  },

  BUG_REPORT_TEAM_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA: {
    CORTADORA_EXTERNA_750: 'Cortadora Externa 750',
    CORTADORA_EXTERNA_751: 'Cortadora Externa 751',
    CORTADORA_EXTERNA_752: 'Cortadora Externa 752',
    CORTADORA_EXTERNA_753: 'Cortadora Externa 753',
    CORTADORA_EXTERNA_754: 'Cortadora Externa 754',
    CORTADORA_EXTERNA_755: 'Cortadora Externa 755',
    CORTADORA_EXTERNA_756: 'Cortadora Externa 756',
    CORTADORA_EXTERNA_757: 'Cortadora Externa 757',
    CORTADORA_EXTERNA_758: 'Cortadora Externa 758',
    CORTADORA_EXTERNA_759: 'Cortadora Externa 759',
    CORTADORA_EXTERNA_760: 'Cortadora Externa 760',
    CORTADORA_EXTERNA_761: 'Cortadora Externa 761',
    CORTADORA_EXTERNA_762: 'Cortadora Externa 762',
    CORTADORA_EXTERNA_763: 'Cortadora Externa 763',
    CORTADORA_EXTERNA_764: 'Cortadora Externa 764',
    CORTADORA_EXTERNA_765: 'Cortadora Externa 765',
    CORTADORA_EXTERNA_766: 'Cortadora Externa 766',
    CORTADORA_EXTERNA_767: 'Cortadora Externa 767',
    CORTADORA_EXTERNA_768: 'Cortadora Externa 768',
    CORTADORA_EXTERNA_769: 'Cortadora Externa 769',
    CORTADORA_EXTERNA_770: 'Cortadora Externa 770',
    CORTADORA_EXTERNA_850: 'Cortadora Externa 850'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_750_751_752: {
    CINTA_PUENTE_750: 'Cinta Puente 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_753_754_755: {
    CORTADORA_SIMPLE_750: 'Cortadora Simple 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_756_757_758: {
    CINTA_LANZADORA_1_750: 'Cinta Lanzadora 1 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_759_760_761: {
    CINTA_LANZADORA_2_750: 'Cinta Lanzadora 2 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_762_763_764_765_766: {
    CORTADORA_MULTIPLE_750: 'Cortadora Multiple 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_767_768: {
    LIMPIADOR_DE_ALAMBRE_750: 'Limpiador de Alambre 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_769_770: {
    RODILLOS_DESVIADORES_750: 'Rodillos Desviadores 750'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_850: {
    CINTA_PUENTE_850: 'Cinta Puente 850',
    CORTADORA_SIMPLE_850: 'Cortadora Simple 850',
    CINTA_LANZADORA_1_850: 'Cinta Lanzadora 1 850',
    CINTA_LANZADORA_2_850: 'Cinta Lanzadora 2 850',
    CORTADORA_MULTIPLE_850: 'Cortadora Multiple 850',
    LIMPIADOR_DE_ALAMBRE_850: 'Limpiador de Alambre 850',
    RODILLOS_DESVIADORES_850: 'Rodillos Desviadores 850'
  },

  BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_CINTA_PUENTE_750_Y_850_LANZADORA_1_Y_2_750_Y_850: {
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda',
    MOTOR_REDUCTOR: 'Motor/Reductor'
  },

  BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_SIMPLE_750_Y_850: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_SUBE_Y_BAJA: 'Motorred Sube y Baja',
    MOTORRED_TRASLACION: 'Motorred Traslación'
  },

  BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_MULTIPLE_750_Y_850: {
    ESTRUCTURA: 'Estructura',
    RODILLOS: 'Rodillos',
    MOTORRED_RODILLOS: 'Motorred Rodillos',
    MOTORRED_ARCO_1: 'Motorred Arco 1',
    MOTORRED_ARCO_2: 'Motorred Arco 2'
  },

  BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_LIMPIADOR_ALAMBRE_750_Y_850: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_RODILLOS_DESVIADORES_750_Y_850: {
    ESTRUCTURA: 'Estructura',
    MOTOR_REDUCTOR: 'Motor/Reductor'
  },

  BUG_REPORT_TEAM_AUTOMATISMO_CORTE_Y_CARGA_MESA_DE_TRANSPORTE: {
    MESA_1: 'Mesa 1',
    MESA_1A: 'Mesa 1A',
    MESA_2: 'Mesa 2',
    MESA_3: 'Mesa 3',
    MESA_4: 'Mesa 4',
    MESA_5: 'Mesa 5',
    MESA_6: 'Mesa 6'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MESA_DE_TRANSPORTE_MESA_1_1A_2_5_6: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MESA_DE_TRANSPORTE_MESA_3_4: {
    PARTE_1: 'Parte 1',
    PARTE_2: 'Parte 2'
  },

  BUG_REPORT_TEAM_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA: {
    RODILLOS_DESVIADORES: 'Rodillos Desviadores',
    CINTA_PULMON_MOVIL: 'Cinta Pulmón Movil',
    CINTA_PULMON_FIJA: 'Cinta Pulmón Fija',
    CINTA_MOVIL_CARGA: 'Cinta Movil Carga',
    MECANISMO_DE_CARGA: 'Mecanismo de Carga'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA_RODILLOS_DESVIADORES: {
    ESTRUCTURA_IZQ: 'Estructura Izquierda',
    MOTORRED_IZQ: 'Motorred Izquierdo',
    ESTRUCTURA_DER: 'Estructura Derecha',
    MOTORRED_DER: 'Motorred Derecho'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA_CINTA_PULMON_MOVIL_Y_MOVIL_CARGA: {
    ESTRUCTURA: 'Estructura',
    BANDA_IZQ: 'Banda Izquierda',
    BANDA_DER: 'Banda Derecha',
    MOTOR_REDUCTOR_1_GIRO_DER: 'Motor/Reductor 1 Giro Derecho',
    MOTOR_REDUCTOR_2_GIRO_IZQ: 'Motor/Reductor 2 Giro Izquierdo',
    MOTOR_ELEVACION: 'Motor Elevación',
    REDUCTOR_ELEVACION_1_IZQ: 'Reductor Elevación 1 Izquierdo',
    REDUCTOR_ELEVACION_2_DER: 'Reductor Elevación 2 Derecho'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA_CINTA_PULMON_FIJA: {
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda',
    MOTOR_REDUCTOR_1_GIRO_DER: 'Motor/Reductor 1 Giro Derecho',
    MOTOR_REDUCTOR_2_GIRO_IZQ: 'Motor/Reductor 2 Giro Izquierdo'
  },

  BUG_REPORT_GROUPS_AUTOMATISMO_DE_CORTE_Y_CARGA_MECANISMO_DE_CARGA: {
    ESTRUCTURA: 'Estructura',
    MOTOR_ELEVACION: 'Motor Elevación',
    REDUCTOR_ELEVACION_1_IZQ: 'Reductor Elevación 1 Izquierdo',
    REDUCTOR_ELEVACION_2_DER: 'Reductor Elevación 2 Derecho',
    MOTOR_REDUCTOR_TRASLACION_PLANCHA: 'Motor/Reductor Traslación Plancha',
    MOTOR_REDUCTOR_BARRERA_1_IZQ: 'Motor/Reductor Barrera 1 Izquierdo',
    MOTOR_REDUCTOR_BARRERA_2_DER: 'Motor/Reductor Barrera 2 Derecho'
  },
  // SECTOR SECADO
  BUG_REPORT_SUBSECTORS_SECADO: {
    SECADERO_TUNEL_PLANTA_2: 'Secadero Tunel Planta 2',
    VENTILACION_INTERNA: 'Ventilación Interna',
    VENTILACION_EXTERNA: 'Ventilación Externa'
  },

  BUG_REPORT_TEAM_SECADO_SECADERO_TUNEL_PLANTA_2: {
    ESTRUCTURA: 'Estructura',
    VAISALA: 'Vaisala',
    TERMOCUPLA: 'Termocupla',
    PRESOSTATOS: 'Presostatos',
    QUEMADORES: 'Quemadores'
  },

  BUG_REPORT_GROUPS_SECADO_SECADERO_TUNEL_PLANTA_2_ESTRUCTURA: {
    PORTON_EXTERNO_ENTRADA: 'Portón Externo Entrada',
    PORTON_INTERNO_ENTRADA: 'Portón Interno Entrada',
    PORTON_INTERNO_SALIDA: 'Portón Interno Salida',
    PORTON_EXTERNO_SALIDA: 'Portón Externo Salida'
  },

  BUG_REPORT_GROUPS_SECADO_SECADERO_TUNEL_PLANTA_2_QUEMADORES: {
    QUEMADOR_1: 'Quemador 1',
    QUEMADOR_2: 'Quemador 2',
    QUEMADOR_3: 'Quemador 3',
    QUEMADOR_6: 'Quemador 6',
    QUEMADOR_7: 'Quemador 7',
    QUEMADOR_4_RECICLO: 'Quemador 4 Reciclo',
    QUEMADOR_5_RECICLO: 'Quemador 5 Reciclo'
  },

  BUG_REPORT_TEAM_SECADO_VENTILACION_EXTERNA: {
    EXTRACCION_1: 'Extracción 1',
    EXTRACCION_2: 'EXtracción 2',
    EXTRACCION_3: 'Extracción 3',
    EXTRACCION_4: 'Extracción 4',
    EXTRACCION_5: 'Extracción 5',
    EXTRACCION_6: 'Extracción 6',
    EXTRACCION_7: 'Extracción 7',
    RECICLO_2: 'Reciclo 2',
    RECICLO_4: 'Reciclo 4',
    INYECTOR_C1: 'Inyector C1',
    INYECTOR_C2: 'Inyector C2',
    INYECTOR_C3: 'Inyector C3',
    CALEFACCION: 'Calefacción',
    INMISION_1: 'Inmisión 1',
    INMISION_2: 'Inmisión 2',
    INMISION_3: 'Inmisión 3',
    INMISION_6: 'Inmisión 6',
    INMISION_7: 'Inmisión 7',
    VALVULAS_AMBIENTE: 'Valvulas Ambiente',
    VALVULAS_ADMISION: 'Valvulas Admisión'
  },

  BUG_REPORT_GROUPS_SECADO_VENTILACION_EXTERNA: {
    EXTRUCTURA: 'Extructura',
    MOTOR: 'Motor'
  },

  BUG_REPORT_TEAM_SECADO_VENTILACION_INTERNA: {
    CANAL_1: 'Canal 1',
    CANAL_2: 'Canal 2',
    CANAL_3: 'Canal 3',
    CANAL_4: 'Canal 4',
    CANAL_5: 'Canal 5',
    CANAL_6: 'Canal 6',
    CANAL_7: 'Canal 7',
    CANAL_8: 'Canal 8',
    CANAL_9: 'Canal 9'
  },

  BUG_REPORT_GROUPS_SECADO_VENTILACION_INTERNA: {
    TRASLACION: 'Traslacion',
    VENTOLAS: 'Ventolas'
  },
  // SECTOR MOVIMENTACION SECADERO
  BUG_REPORT_SUBSECTORS_MOVIMENTACION_SECADERO: {
    EXTERNA: 'Externa',
    TRASBORDO: 'Trasbordo'
  },

  BUG_REPORT_TEAM_MOVIMENTACION_SECADERO_EXTERNA: {
    CADENA_1_PULMON_VERDE: 'Cadena 1 Pulmon de Verde',
    CADENA_2_PULMON_VERDE: 'Cadena 2 Pulmon de Verde',
    CADENA_PRE_CARGA_TRB_ENTRADA: 'Cadena pre Carga TRB Entrada',
    CADENA_1_PULMON_SECO: 'Cadena 1 Pulmon de Seco',
    CADENA_2_PULMON_SECO: 'Cadena 2 Pulmon de Seco',
    CADENA_3_SECO: 'Cadena 3 Seco',
    CADENA_CAMBIO_CARRO_APILADORA: 'Cadena Cambio Carro Apiladora',
    CADENA_CARROS_VACIOS: 'Cadena Carros Vacios',
    CADENA_POSICIONA_CARGA_VERDE: 'Cadena Posiciona Carga Verde'
  },

  BUG_REPORT_GROUPS_MOVIMENTACION_SECADERO_EXTERNA: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_TEAM_MOVIMENTACION_SECADERO_TRASBORDO: {
    TRB_ENTRADA: 'TRB Entrada',
    TRB_SALIDA: 'TRB Salida'
  },

  BUG_REPORT_GROUPS_MOVIMENTACION_SECADERO_TRASBORDO: {
    EMPUJADOR_1: 'Empujador 1',
    EMPUJADOR_2: 'Empujador 2',
    CENTRALINA: 'Centralina',
    ESTRUCTURA: 'Estructura'
  },
  // SECTOR APILADO
  BUG_REPORT_SUBSECTORS_APILADO: {
    MECANISMO_DESCARGA: 'Mecanismo de Descarga',
    MESA_TRANSPORTE: 'Mesa de Transporte',
    PINZA: 'Pinza'
  },

  BUG_REPORT_TEAM_APILADO_MECANISMO_DESCARGA: {
    RODILLOS_DESCARGA: 'Rodillos Descarga',
    CINTA_MOVIL: 'Cinta Movil',
    RODILLOS_MOVILES: 'Rodillos Moviles'
  },

  BUG_REPORT_GROUPS_APILADO_MECANISMO_DESCARGA_RODILLOS_DESCARGA: {
    ESTRUCTURA: 'Estructura',
    MOTOR_ELEVACION: 'Motor Elevacion',
    REDUCTORA_ELEVACION_DER: 'Reductora Elevacion Derecha',
    REDUCTORA_ELEVACION_IZQ: 'Reductora Elevacion Izquierda',
    MOTORRED_TRASLACION_PLANCHA: 'Motorred Traslacion Plancha',
    MOTORRED_TRASLACION_PALA: 'Motorred Traslacion Pala'
  },

  BUG_REPORT_GROUPS_APILADO_MECANISMO_DESCARGA_CINTA_MOVIL: {
    ESTRUCTURA: 'Estructura',
    BANDA_IZQ: 'Banda Izquierda',
    BANDA_DER: 'Banda Derecha',
    MOTOR_ELEVACION: 'Motor Elevacion',
    REDUCTORA_ELEVACION_DER: 'Reductora Elevacion Derecha',
    REDUCTORA_ELEVACION_IZQ: 'Reductora Elevacion Izquierda',
    MOTORRED_BANDA_IZQ: 'Motorred Banda Izquierda',
    MOTORRED_BANDA_DER: 'Motorred Banda Derecha'
  },

  BUG_REPORT_GROUPS_APILADO_MECANISMO_DESCARGA_RODILLOS_MOVILES: {
    ESTRUCTURA: 'Estructura',
    MOTOR_ELEVACION: 'Motor Elevacion',
    REDUCTORA_ELEVACION_DER: 'Reductora Elevacion Derecha',
    REDUCTORA_ELEVACION_IZQ: 'Reductora Elevacion Izquierda',
    MOTORRED_RODILLOS: 'Motorred Rodillos',
    MOTORRED_ALINEADO_IZQ: 'Motorred Alineado Izquierdo',
    MOTORRED_ALINEADO_DER: 'Motorred Alineado Derecho'
  },

  BUG_REPORT_TEAM_APILADO_MESA_TRANSPORTE: {
    Z1: 'Z1',
    Z2: 'Z2',
    Z3: 'Z3',
    Z4: 'Z4',
    Z5: 'Z5',
    Z6: 'Z6'
  },

  BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z1: {
    Z1_RODILLOS_1: 'Z1 Rodillos 1',
    Z1_CINTA_1: 'Z1 Cinta 1',
    Z1_RODILLOS_2: 'Z1 Rodillos 2',
    Z1_RODILLOS_1_Z1_A_Z6: 'Z1 Rodillos 1 A Z6',
    Z1_RODILLOS_2_Z1_A_Z6: 'Z1 Rodillos 2 A Z6',
    Z1_BARRERA_Z1_A_Z2: 'Z1 Barrera Z1 A Z2',
    Z1_BARRERA_Z1_A_Z6: 'Z1 Barrera Z1 A Z6'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_1: {
    ESTRUCTURA: 'Estructura',
    RODILLOS_IZQ: 'Rodillos Izquierdos',
    RODILLOS_DER: 'Rodillos Derechos',
    MOTORRED_IZQ: 'Motorred Izquierdo',
    MOTORRED_DER: 'Motorred Derecho'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_CINTA_1: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_IZQ: 'Motorred Izquierdo',
    MOTORRED_DER: 'Motorred Derecho',
    BANDA_IZQ: 'Banda Izquierda',
    BANDA_DER: 'Banda Derecha'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_2: {
    RODILLOS_IZQ: 'Rodillos Izquierdos',
    RODILLOS_DER: 'Rodillos Derechos',
    MOTORRED_IZQ: 'Motorred Izquierdo'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_1_Z1_A_Z6: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_DER: 'Motorred Derecho',
    RODILLOS: 'Rodillos'

  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_2_Z1_A_Z6: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred',
    RODILLOS: 'Rodillos'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_BARRERA_Z1_A_Z2_Y_Z1_A_Z6: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z2: {
    Z2_MESA_1: 'Z2 Mesa 1',
    Z2_MESA_2: 'Z2 Mesa 2',
    Z2_MESA_3: 'Z2 Mesa 3',
    Z2_MESA_4: 'Z2 Mesa 4',
    Z2_MESA_5: 'Z2 Mesa 5',
    Z2_MESA_6: 'Z2 Mesa 6',
    Z2_BARRERA_FRONTAL: 'Z2 Barrera Frontal',
    Z2_RODILLOS_DESV_A_25: 'Z2 Rodillos Desv A Z5'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z2_MESA_Y_BARRERA: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z2_RODILLOS: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_TRASLACION: 'Motorred Traslacion',
    RODILLOS: 'Rodillos'
  },

  BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z3: {
    Z3_CADENA_1: 'Z3 Cadena 1',
    Z3_RODILLOS_1: 'Z3 Rodillos 1',
    Z3_RODILLOS_2_Z3_Z2: 'Z3 Rodillos 2 (Z3 a Z2)',
    Z3_RODILLOS_3: 'Z3 Rodillos 3',
    Z3_RODILLOS_4_Z3_Z6: 'Z3 Rodillos 4 (Z3 a Z6)',
    Z3_BARRERA_Z3_Z6: 'Z3 Barrera Z3 a Z6',
    Z3_BARRERA_Z3_Z2: 'Z3 Barrera Z3 a Z2'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z3: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z4: {
    Z4_CINTA_1: 'Z4 Cinta 1',
    Z4_CINTA_2: 'Z4 Cinta 2',
    Z4_RODILLO_COMPACTADOR: 'Z4 Rodillo con Compactador',
    Z4_CINTA_PROGRAMACION: 'Z4 Cinta Programación'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z4_CINTA: {
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z4_RODILLO: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred',
    RODILLO: 'Rodillo',
    MOTORRED_RODILLO: 'Motorred Rodillo'
  },

  BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z5: {
    Z5_CINTA_1: 'Z5 Cinta 1',
    Z5_CINTA_2: 'Z5 Cinta 2',
    Z5_RODILLO_COMPACTADOR: 'Z5 Rodillo con Compactador',
    Z5_CINTA_PROGRAMACION: 'Z5 Cinta Programación',
    CINTA_CARRELO: 'Cinta Carrelo'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_CINTA_1: {
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda',
    MOTORRED_COMPACTADOR: 'Motorred Compactador'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_CINTA_2_Y_PROGRAMACION: {
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_RODILLO_COMPACTADOR: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred',
    RODILLO: 'Rodillo',
    MOTORRED_RODILLO: 'Motorred Rodillo',
    MOTORRED_COMPACTADOR: 'Motorred Compactador'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_CINTA_CARRELO: {
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda',
    MOTORRED_TRASLACION: 'Motorred Traslacion',
    MOTORRED_GIRO: 'Motorred Giro'
  },

  BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z6: {
    Z6_MESA_1: 'Z6 Mesa 1',
    Z6_MESA_2: 'Z6 Mesa 2',
    Z6_MESA_3: 'Z6 Mesa 3',
    Z6_MESA_4: 'Z6 Mesa 4',
    Z6_MESA_5: 'Z6 Mesa 5',
    Z6_MESA_6: 'Z6 Mesa 6',
    Z6_BARRERA_FRONTAL: 'Z6 Barrera Frontal',
    Z6_RODILLO_DESV_Z4: 'Z6 Rodillo Desv a Z4'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z6_MESA: {
    ESTRUCTURA: 'Estructura',
    MOTORRED: 'Motorred'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z6_BARRERA_FRONTAL: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_TRASLACION: 'Motorred Traslacion'
  },

  BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z6_RODILLO_DESV_Z4: {
    ESTRUCTURA: 'Estructura',
    RODILLO: 'Rodillo',
    MOTORRED_TRASLACION: 'Motorred Traslacion'
  },

  BUG_REPORT_TEAM_APILADO_PINZA: {
    ROBOT: 'Robot'
  },

  BUG_REPORT_GROUPS_APILADO_PINZA: {
    ROBOT_1: 'Robot 1',
    ROBOT_2: 'Robot 2'
  },

  BUG_REPORT_PARTS_APILADO_PINZA: {
    ESTRUCTURA: 'Estructura',
    PINZA: 'Pinza',
    J1: 'J1',
    J2: 'J2',
    J3: 'J3',
    J4: 'J4'
  },
  // SECTOR HORNO
  BUG_REPORT_SUBSECTORS_HORNO: {
    HORNO: 'Horno',
    VAGONETAS: 'Vagonetas',
    VENTILACION: 'Ventilación',
    QUEMADORES: 'Quemadores'
  },

  BUG_REPORT_TEAM_HORNO: {
    PORTONES: 'Portones',
    TUBERIAS_CONDUCTOS: 'Tuberias/Conductos',
    VALVULAS: 'Valvulas',
    RAMPA_GAS: 'Rampa de Gas'
  },

  BUG_REPORT_GROUPS_HORNO_PORTONES: {
    PUERTA_PRE_HORNO_ENTRADA: 'Puerta Pre Horno Entrada',
    PUERTA_HORNO_ENTRADA: 'Puerta Horno Entrada',
    PUERTA_SALIDA_HORNO: 'Puerta Salida Horno',
    PUERTA_POST_SALIDA_HORNO: 'Puerta Post Salida Horno'
  },

  BUG_REPORT_TEAM_HORNO_VAGONETAS: {
    VAGONETAS_PLANTA_2: 'Vagonetas Planta 2'
  },

  BUG_REPORT_TEAM_HORNO_VENTILACION: {
    M1_CHIMENEA: 'M1 Chimenea',
    M3_RECICLO: 'M3 Reciclo',
    M2_EXTRACCION_BAJO_BAGONETA: 'M2 Extracción Bajo Vagoneta',
    M25_REFRIGERACION_BAJO_BAGONETA: 'M25 Refrigeración Bajo Bagoneta',
    M26_REFRIGERACION_BAJO_BAGONETA: 'M26 Refrigeración Bajo Bagoneta',
    M27_REFRIGERACION_BAJO_BAGONETA: 'M27 Refrigeración Bajo Bagoneta',
    M28_REFRIGERACION_BAJO_BAGONETA: 'M28 Refrigeración Bajo Bagoneta',
    M29_REFRIGERACION_BAJO_BAGONETA: 'M29 Refrigeración Bajo Bagoneta',
    M30_REFRIGERACION_BAJO_BAGONETA: 'M30 Refrigeración Bajo Bagoneta',
    M4_COMBURENTE_QUEM_LATERALES: 'M4 Comburente QUEM Laterales',
    M5_COMBURENTE_QUEM_LATERALES: 'M5 Comburente QUEM Laterales',
    M6_INMISION_BOVEDA: 'M6 Inmisión Boveda',
    M7_INMISION_BOVEDA: 'M7 Inmisión Boveda',
    M8_INMISION_BOVEDA: 'M8 Inmisión Boveda',
    M9_INMISION_BOVEDA: 'M9 Inmisión Boveda',
    M10_INMISION_BOVEDA: 'M10 Inmisión Boveda',
    M11_INMISION_BOVEDA: 'M11 Inmisión Boveda',
    M12_INMISION_BOVEDA: 'M12 Inmisión Boveda',
    M13_INMISION_BOVEDA: 'M13 Inmisión Boveda',
    M14_INMISION_BOVEDA: 'M14 Inmisión Boveda',
    M15_INMISION_BOVEDA: 'M15 Inmisión Boveda',
    M16_INMISION_BOVEDA: 'M16 Inmisión Boveda',
    M17_ENFRIAMIENTO_LATERAL: 'M17 Enfriamiento Lateral',
    M18_ENFRIAMIENTO_LATERAL: 'M18 Enfriamiento Lateral',
    M19_ENFRIAMIENTO_LATERAL: 'M19 Enfriamiento Lateral',
    M20_ENFRIAMIENTO_LATERAL: 'M20 Enfriamiento Lateral',
    M21_RECUPERO_ALTA: 'M21 Recupero Alta',
    M22_RECUPERO_BAJA: 'M22 Recupero Baja',
    M23_CONTRAPRESION: 'M23 Contrapresión',
    M24_CONTRAPRESION: 'M24 Contrapresión'
  },

  BUG_REPORT_GROUPS_HORNO_VENTILACION: {
    ESTRUCTURA: 'Estructura',
    MOTOR: 'Motor'
  },

  BUG_REPORT_TEAM_HORNO_QUEMADORES: {
    LATERALES: 'Laterales',
    BOVEDA: 'Boveda'
  },
  // SECTOR MOVIMENTACION DE HORNO
  BUG_REPORT_SUBSECTORS_MOVIMENTACION_HORNO: {
    EXTERNA: 'Externa',
    TRASBORDO: 'Trasbordo'
  },

  BUG_REPORT_TEAM_MOVIMENTACION_HORNO_EXTERNA: {
    ESLINGA_COCIDO: 'Eslinga Cocido',
    ESLINGA_VACIAS: 'Eslinga Vacias',
    ESLINGA_SECO: 'Eslinga Seco',
    FRENOS_BALLESTA: 'Frenos Ballesta',
    EMPUJADORES_BLOQUEADORES: 'Empujadores/Bloqueadores'
  },

  BUG_REPORT_GROUPS_MOVIMENTACION_HORNO_EXTERNA: {
    ESTRUCTURA: 'Estructura',
    MOTOR: 'Motor',
    CENTRALINA: 'Centralina'
  },

  BUG_REPORT_TEAM_MOVIMENTACION_HORNO_TRASBORDO: {
    HORNO_PLANTA_MOVIMIENTO_TRASBORDO: 'Horno Planta Movimiento Trasbordo'
  },

  BUG_REPORT_GROUPS_MOVIMENTACION_HORNO_TRASBORDO: {
    TRB_ENTRADA: 'TRB Entrada',
    TRB_SALIDA: 'TRB Salida'
  },

  BUG_REPORT_PARTS_MOVIMENTACION_HORNO_TRASBORDO: {
    ESTRUCTURA: 'Estructura',
    EMPUJADOR_1: 'Empujador 1',
    EMPUJADOR_2: 'Empujador 2',
    CENTRALINA: 'Centralina'
  },
  // SECTOR DESPILADO Y EMPAQUE
  BUG_REPORT_SUBSECTORS_DESAPILADO_EMPAQUE: {
    PINZA: 'Pinza',
    LIMPIEZA_VAGONETAS: 'Limpieza Vagonetas',
    ENVOLVEDORA: 'Envolvedora',
    PEGADO_FILM: 'Pegado de Film',
    MESA_TRANSPORTE: 'Mesa de Transporte',
    FLEJADORA: 'Flejadora',
    REMOJADORA: 'Remojadora'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_PINZA: {
    PINZA_1: 'Pinza 1',
    PINZA_COMPOSICION: 'Pinza Composición'
  },

  BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_PINZA_1: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_ELEVACION: 'Motorred Elevacion',
    MOTORRED_GIRO_1: 'Motorred Giro 1',
    MOTORRED_GIRO_2: 'Motorred Giro 2',
    MOTORRED_TRASLACION: 'Motorred Traslacion'
  },

  BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_PINZA_COMPOSICION_Y_REMOJADORA: {
    ESTRUCTURA: 'Estructura',
    MOTORRED_ELEVACION: 'Motorred Elevacion',
    MOTORRED_TRASLACION: 'Motorred Traslacion'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_LIMPIEZA_VAGONETAS: {
    ASPIRADORA: 'Aspiradora'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_ENVOLVEDORA: {
    ENVOLVERODA_1_P2: 'Envolvedora 1 P2',
    ENVOLVERODA_2_P2: 'Envolvedora 2 P2',
    ENVOLVERODA_3_P2: 'Envolvedora 3 P2'
  },

  BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_ENVOLVEDORA: {
    MOTORRED_GIRO: 'Motorred Giro',
    MOTORRED_MOV_VERTICAL: 'Motorred Movimiento Vertical',
    MOTOR_TENSION_FILM: 'Motor Tension Film',
    ESTRUCTURA: 'Estructura'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_PEGADO_FILM: {
    RODILLOS_CALENTADORES_Z2: 'Rodillos Calentadores Z2',
    RODILLOS_CALENTADORES_Z6: 'Rodillos Calentadores Z6'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_MESA_TRANSPORTE: {
    Z2: 'Z2',
    Z6: 'Z6'
  },

  BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_MESA_TRANSPORTE: {
    MESA_1: 'Mesa 1',
    MESA_2: 'Mesa 2',
    MESA_3: 'Mesa 3',
    MESA_4: 'Mesa 4',
    MESA_5: 'Mesa 5',
    MESA_6: 'Mesa 6',
    MESA_7: 'Mesa 7',
    MESA_8: 'Mesa 8',
    MESA_9: 'Mesa 9',
    MESA_10: 'Mesa 10',
    MESA_11: 'Mesa 11',
    MESA_12: 'Mesa 12',
    MESA_13: 'Mesa 13',
    MESA_14: 'Mesa 14'
  },

  BUG_REPORT_PARTS_DESAPILADO_EMPAQUE_MESA_TRANSPORTE: {
    MOTORRED: 'Motorred',
    ESTRUCTURA: 'Estructura'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_FLEJADORA: {
    ETIQUETADORA_2: 'Etiquetadora 2'
  },

  BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_REMOJADORA: {
    PINZA_BAÑATURA_2: 'Pinza Bañatura 2'
  },
  // SECTOR SERVICIOS AUXILIARES
  BUG_REPORT_SUBSECTORS_SERVICIOS_AUXILIARES: {
    ENERGIA_ELECTRICA: 'Energia Electrica',
    MOLDES: 'Moldes',
    GAS: 'Gas',
    VAPOR: 'Vapor',
    AIRE: 'Aire',
    AUTOELEVADORES_PRODUCCION: 'Autoelevadores Produccion',
    MAQ_LIMPIEZA: 'Maq. Limpieza',
    GENERADORES: 'Generadores',
    OTROS_SERVICIOS: 'Otros Servicios'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_ENERGIA_ELECTRICA: {
    TABLEROS_PLANTA_2: 'Tableros Planta 2',
    TABLERO_PREELABORACION: 'Tablero Preelaboracion',
    TABLEROS_SILO: 'Tableros Silo',
    TABLEROS_HORNO_PLANTA: 'Tableros Horno Planta',
    TABLEROS_DESAPILADORA_ENVOLVEDORA: 'Tableros desapiladora/Envolvedora',
    TGBT_2: 'TGBT 2',
    TGBT_3: 'TGBT 3',
    TABLERO_MOLINO: 'Tablero Molino',
    CAMARA_TRANSFORMADORES: 'Camara Transformadores'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_MOLDES: {
    LAVADORA_MOLDES_850: 'Lavadora de Moldes 850',
    MOLDES_750: 'Moldes 750',
    MOLDES_850: 'Moldes 850'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_GAS: {
    INSTALACIONES_GAS: 'Instalaciones Gas'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_VAPOR: {
    INSTALACIONES_AGUA_CALDERA: 'Instalaciones de Agua Y Caldera'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_AUTOELEVADORES_PRODUCCION: {
    AE_N8_HYSTER: 'AE N8 HYSTER H190HD 2007-3041',
    AE_N9_HYSTER: 'AE N9 HYSTER H190HD2 1751-2012',
    AE_N15_HYSTER: 'AE N15 HYSTER H190HD2 2577-2016'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_MAQ_LIMPIEZA: {
    EQUIPO_LIMPIEZA_DULEVO_120DK: 'Equipo Limpieza DULEVO 120DK'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_GENERADORES: {
    GRUPOS_ELECTROGENOS_1: 'Grupos Electrogenos 1 Marca GM',
    GRUPOS_ELECTROGENOS_2: 'Grupos Electrogenos 2 Marca CAT'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_AIRE: {
    INSTALACIONES_AIRE_COMP: 'Instalaciones de Aire y Comp.'
  },

  BUG_REPORT_GROUPS_SERVICIOS_AUXILIARES_AIRE: {
    INSTALACION_NEUMATICA: 'Instalacion Neumatica',
    COMPRESOR_1_12: 'Compresor 1 12-60 8738 SULLAIR',
    COMPRESOR_2_12: 'Compresor 2 12-60 10134 SULLAIR',
    COMPRESOR_3: 'Compresor 3 60/12 CECCATO 60/12',
    COMPRESOR_4: 'Compresor 4 SE4509 11775 SULLAIR',
    COMPRESOR_5: 'Compresor 5 50/8 CECCATO',
    COMPRESOR_6: 'Compresor 6 SE5509V SULLAIR'
  },

  BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_OTROS_SERVICIOS: {
    MINICARGADOR_BOBCAT: 'MiniCargador BOBCAT -S 530-DBS 03',
    INSTALACIONES_COMBUSTIBLE: 'Instalaciones de Combustible',
    AE_N3: 'AE N3 YALE 4500 1978',
    AE_N4: 'AE N4 YALE GDPT 30 1998',
    AE_N6: 'AE N6 HYSTER H 60XM 1997',
    AE_N7: 'AE N7 HYSTER H 60XM 1998',
    AE_N11: 'AE N11 HYSTER H 90 FT 3117 2010',
    AE_N18: 'AE N18 HYSTER H2,5UT 2021',
    AE_N19: 'AE N19 HYSTER H2,5UT 2021'
  },

  BUG_REPORT_GROUPS_SERVICIOS_AUXILIARES_OTROS_SERVICIOS_INSTALACIONES: {
    TANQUE: 'Tanque',
    SURTIDOR: 'Surtidor',
    CAÑERIAS: 'Cañerias'
  },
  // LINEA 0
  BUG_REPORT_SECTORS_LINE_0: {
    PRELABORACION: 'Prelaboracion',
    SILO: 'Silo',
    PRODUCCION: 'Produccion',
    MOVIMENTACION_HORNO: 'Movimentacion de Horno',
    PLAYA_EXPEDICION: 'Playa Expedicion',
    INSTALACIONES_EDIFICIOS: 'Instalaciones y Edificios',
    SERVICIOS_AUXILIARES: 'Servicios Auxiliares',
    PREPARACION_MAT_PRIMAS: 'Preparacion de Materias Primas'
  },
  // SECTOR INSTALACIONES Y EDIFICIOS
  BUG_REPORT_SUBSECTORS_INSTALACIONES_EDIFICIOS: {
    INSTALACIONES: 'Instalaciones'
  },

  BUG_REPORT_TEAM_INSTALACIONES_EDIFICIOS: {
    EDIFICIOS: 'Edificios',
    INSTALACIONES_ELECTRICAS: 'Instalaciones electrias',
    SISTEMA_CONTRA_INCENDIO: 'Sistema Contra Incendio'
  },

  BUG_REPORT_SUBSECTORS_PLAYA_EXPEDICION: {
    MANTENIMIENTO_PLAYA: 'Mantenimiento Playa',
    AUTOELEVADORES_PLAYA: 'Autoelevadores Playa'
  },

  BUG_REPORT_TEAM_PLAYA_EXPEDICION_MANTENIMIENTO_PLAYA: {
    PLAYAS: 'Playas'
  },

  BUG_REPORT_TEAM_PLAYA_EXPEDICION_AUTOELEVADORES_PLAYA: {
    AE_N10: 'AE N10 HYSTER H 90 FT 3115 2010',
    AE_N12: 'AE N12 HYSTER 80FT 2424 2013',
    AE_N13: 'AE N13 HYSTER 80FT 2418 2013',
    AE_N16: 'AE N16 HYSTER H80 FT 2805 2016',
    AE_N117: 'AE N17 HYSTER H80 FT 2808 2016'
  },

  BUG_REPORT_SUBSECTORS_PREPARACION_MAT_PRIMAS: {
    PREPARACION: 'Preparacion'
  },

  BUG_REPORT_TEAM_PREPARACION_MAT_PRIMAS: {
    PALA_N5: 'PALA N5 CAT 950 H 2008-1147 MI',
    PALA_N6: 'PALA N6 CAT 980H 2008-JM3262',
    PALA_N7: 'PALA N7 CAT 966 H 2012-1148',
    PALA_N8: 'PALA N8 CAT 966H 2015 BS0289'
  }

}

/*

BUG_REPORT_SUBSECTORS_SILO: {
    TRANSPORTE: 'Transporte',
    DRAGA: 'Draga'
},

BUG_REPORT_TEAM_SILO_TRANSPORTE: {
    SILO_2_STACKER_1: 'Silo 2 Stacker 1',
    SILO_2_STACKER_2: 'Silo 2 Stacker 2',
},

BUG_REPORT_GROUP_SILO_TRANSPORTE: {
    CINTA_MOVIL: 'Cinta Movil',
    CINTA_FIJA: 'Cinta Fija',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_PART_SILO_TRANSPORTE_MOVIL: {
    MOTORRED_GIRO:' Motorred Giro',
    MOTORRED_TRASLACION: 'Motorred Traslacion',
    BANDA: 'Banda',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_PART_SILO_TRANSPORTE_FIJA: {
    MOTORRED_GIRO:' Motorred Giro',
    BANDA: 'Banda',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_TEAM_SILO_DRAGA: {
    SILO_2_EXCAVADOR: 'Silo 2 Excavador'
},

BUG_REPORT_GROUP_SILO_DRAGA: {
    CINTA_MOVIL: 'Cinta Movil',
    CINTA_FIJA: 'Cinta Fija',
    PUENTE: 'Puente',
    CARRO_BRAZO: 'Carro Brazo'
},

BUG_REPORT_PARTS_SILO_DRAGA_PUENTE_CARRO:{
    MOTORRED_TRASLACION: 'Motorred Traslacion',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_PARTS_SILO_DRAGA_BRAZO:{
    MOTORRED_ELEVACION: 'Motorred Elevacion',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_PARTS_SILO_DRAGA_FIJA: {
    MOTORRED_GIRO:' Motorred Giro',
    BANDA: 'Banda',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_PARTS_SILO_DRAGA_MOVIL: {
    MOTORRED_GIRO:' Motorred Giro',
    MOTORRED_TRASLACION: 'Motorred Traslacion',
    BANDA: 'Banda',
    ESTRUCTURA: 'Estructura'
},

*/

/*

BUG_REPORT_SUBSECTORS_PRELABORACION: {
    ADITIVO: 'Aditivo',
    PREPARACION: 'Preparacion',
    TRANSPORTE: 'Transporte',
    BALANZA: 'Balanza',
    MOLIENDA_CHAMOTE: 'Molienda Chamote'
},

BUG_REPORT_TEAM_PRELABORACION_ADITIVO: {
    DOSIFICADOR_CASCARA_1: 'Dosificador de Cascara 1',
    DOSIFICADOR_CASCARA_2: 'Dosificador de Cascara 2',
    DOSIFICADOR_CASCARA_3: 'Dosificador de Cascara 3',
    DOSIFICADOR_CASCARA_4: 'Dosificador de Cascara 4',
    DOSIFICADOR_ARENA_1: 'Dosificador de Arena 1',
    DOSIFICADOR_ARENA_2: 'Dosificador de Arena 2'
},

BUG_REPORT_GROUP_PRELABORACION_ADITIVO: {
    MOTOR_MOTORRED: 'Motor/Motorred',
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda'
},

BUG_REPORT_TEAM_PRELABORACION_PREPARACION: {
    CAJON_1_MP1: 'Cajon 1 Preelaboracion Linea MP 1',
    CAJON_1_MP2: 'Cajon 1 Preelaboracion Linea MP 2',
    CAJON_1_MP3: 'Cajon 1 Preelaboracion Linea MP 3',
    CAJON_1_MP4: 'Cajon 1 Preelaboracion Linea MP 4',
    CAJON_1_MP5: 'Cajon 1 Preelaboracion Linea MP 5',
    ROTOFILTRO_1: 'Rotofiltro Preelaboracion L 1 MP',
    ROTOFILTRO_2: 'Rotofiltro Preelaboracion L 2 MP',
    ROTOFILTRO_3: 'Rotofiltro Preelaboracion L 3 MP',
    ROTOFILTRO_4: 'Rotofiltro Preelaboracion L 4 MP',
    ROTOFILTRO_5: 'Rotofiltro Preelaboracion L 5 MP',
    MEZCLADOR_1: 'Mezclador 6 Preelab. L 1 MP',
    MEZCLADOR_2: 'Mezclador 6 Preelab. L 2 MP',
    MEZCLADOR_3: 'Mezclador BEDESCHI 4500 L 3 MP',
    MEZCLADOR_4: 'Mezclador BEDESCHI 4500 L 4 MP',
    MEZCLADOR_5: 'Mezclador BEDESCHI 4500 L 5 MP',
    TRITURADOR: 'Triturador',
    DIVISOR_TIERRA: 'Divisor de Tierra'
},

BUG_REPORT_GROUP_PRELABORACION_PREPARACION_CAJON: {
    MOTOR_MOTORRED: 'Motor/Motorred',
    MOTOR_MOTORRED_ASPAS: 'Motor/Motorred Aspas',
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda'
},

BUG_REPORT_GROUP_PRELABORACION_PREPARACION_ROTOFILTRO: {
    MOTOR_MOTORRED: 'Motor/Motorred',
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_GROUP_PRELABORACION_PREPARACION_MEZCLADOR_TRITURADOR: {
    MOTOR_MOTORRED: 'Motor/Motorred',
    ESTRUCTURA: 'Estructura',
    CAJA_REDUCTORA: 'Caja Reductora'
},

BUG_REPORT_GROUP_PRELABORACION_PREPARACION_DIVISOR: {
    ESTRUCTURA: 'Estructura'
},

BUG_REPORT_TEAM_PRELABORACION_BALANZA: {
    BALANZA_1: 'Balanza 1',
    BALANZA_2: 'Balanza 2'
},

BUG_REPORT_TEAM_PRELABORACION_MOLIENDA: {
    MOLIENDA_CHAMOTE: 'MoliendA Chamote'
},

BUG_REPORT_TEAM_PRELABORACION_TRANSPORTE: {
    CINTAS_PREELABORACION: 'Cintas Preelaboracion',
    CINTAS_1: 'Cintas 1',
    CINTA_DESCARTE_ROTOFILTRO_5: 'Cinta Descarte Rotofiltro 5',
    CINTA_DESCARTE_ROTOFILTRO_4: 'Cinta Descarte Rotofiltro 4',
    CINTA_DESCARTE_5: 'Cinta Descarte 5',
    CINTA_DESCARTE_4: 'Cinta Descarte 4',
    CINTA_DESCARTE_3: 'Cinta Descarte 3',
    CINTA_DESCARTE_2: 'Cinta Descarte 2',
    CINTA_DESCARTE_1: 'Cinta Descarte 1',
    CINTA_9: 'Cinta 9',
    CINTA_8: 'Cinta 8',
    CINTA_7: 'Cinta 7',
    CINTA_6_16: 'Cinta 6.16',
    CINTA_6_15: 'Cinta 6.15',
    CINTA_6_14: 'Cinta 6.14',
    CINTA_6_13: 'Cinta 6.13',
    CINTA_6_12: 'Cinta 6.12',
    CINTA_6_11: 'Cinta 6.11',
    CINTA_6_10: 'Cinta 6.10',
    CINTA_5_29: 'Cinta 5.29',
    CINTA_5_28: 'Cinta 5.28',
    CINTA_5_27: 'Cinta 5.27',
    CINTA_5_26: 'Cinta 5.26',
    CINTA_5_25: 'Cinta 5.25',
    CINTA_5_24: 'Cinta 5.24',
    CINTA_5_21: 'Cinta 5.21',
    CINTA_20: 'Cinta 20',
    CINTA_5_10: 'Cinta 5.10',
    CINTA_5_11: 'Cinta 5.11',
    CINTA_5_12: 'Cinta 5.12',
    CINTA_5_13: 'Cinta 5.13',
    CINTA_5_14: 'Cinta 5.14',
    CINTA_5_15: 'Cinta 5.15',
    CINTA_5_16: 'Cinta 5.16',
    CINTA_5_17: 'Cinta 5.17',
    CINTA_5_18: 'Cinta 5.18',
    CINTA_5_19: 'Cinta 5.19',
    CINTA_5_20: 'Cinta 5.20',
    CINTA_5: 'Cinta 5',
    CINTA_4: 'Cinta 4',
    CINTA_3: 'Cinta 3',
    CINTA_24: 'Cinta 24',
    CINTA_23: 'Cinta 23',
    CINTA_2_10: 'Cinta 2.10',
    CINTA_2: 'Cinta 2',
    CINTA_14: 'Cinta 14',
    CINTA_13: 'Cinta 13',
    CINTA_12: 'Cinta 12',
    CINTA_11: 'Cinta 11',
    CINTA_10: 'Cinta 10'
},

BUG_REPORT_GROUP_PRELABORACION_TRANSPORTE: {
    MOTOR_MOTORRED: 'Motor/Motorred',
    ESTRUCTURA: 'Estructura',
    BANDA: 'Banda'
},

BUG_REPORT_GROUP_PRELABORACION_TRANSPORTE_CINTAS_PREELABORACION: {
    MOTOR_MOTORRED: 'Motor/Motorred'
},

*/
