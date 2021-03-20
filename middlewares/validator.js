'use strict'
const path = require('path')
const {check: body, param, validationResult, query} = require('express-validator/check')
const winston = require('winston')
const _ = require('lodash')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError

function validatorMiddleware (req, res, next) {
  try {
    validationResult(req).throw()
    next()
  } catch (err) {
    winston.log('debug', 'Missing required data: ', {err: err.mapped()})
    let errorMessages = _.map(err.mapped(), error => error.msg)
    let message = _.reduce(errorMessages,
      (acc, msg) => acc + ' ' + msg + ',',
      '')
    next(new AppError('Missing params', message, 422))
  }
}

const BODY_USERNAME_REQUIRED = body('username').exists().withMessage('Username es obligatorio')
const BODY_PASSWORD_REQUIRED = body('password').exists().withMessage('Password es obligatorio')
const BODY_TYPE_REQUIRED = body('item.type').exists().withMessage('El tipo es obligatorio')
const BODY_BRAND_REQUIRED = body('item.brand').exists().withMessage('La marca es obligatoria')
const BODY_MODEL_REQUIRED = body('item.model').exists().withMessage('El modelo es obligatorio')
const BODY_CERTIFIED_REQUIRED = body('item.certified').exists().withMessage('La certificacion es obligatoria')
const BODY_DESCRIPTION_REQUIRED = body('item.description').exists().withMessage('La descripcion es obligatoria')
const BODY_REQUEST = body('request').exists().withMessage('Es necesario hacer una solicitud')
const BODY_REQUEST_COLLABORATOR = body('request.collaborator').exists().withMessage('El colaborador es obligatorio')
const BODY_REQUEST_PROPERTIES = body('request.items').exists().withMessage('Las propiedades son obligatorias')
const BODY_REQUEST_DATE = body('request.request_date').exists().withMessage('Las fecha son obligatoria')
const PARAM_ID_REQUIRED = param('id').exists().withMessage('El id es obligatorio')
const BODY_APPROVED = body('approved').exists().withMessage('Debe indicar si esta aprobado o no')
const BODY_SUBSCRIPTION_REQUIRED = body('subscription').exists().withMessage('Debe enviar la suscripcion')
const BODY_CHECK_ID_REQUIRED = body('check.id').exists().withMessage('Debe enviar el id del check')
const BODY_CHECK_VALUE_REQUIRED = body('check.value').exists().withMessage('Debe enviar el value del check')
const BODY_CHECK_COMMENT_REQUIRED = body('check.comment').exists().withMessage('Debe enviar el comentario del check')
const BODY_CHECK_OBSERVATION_REQUIRED = body('observation.observation').exists().withMessage('Debe enviar la observacion del check')
const BODY_CHECKLIST_ID_REQUIRED = body('check.checklist_id').exists().withMessage('Debe enviar el checklist del check')
const QUERY_DATE_REQUIRED = query('date').exists().withMessage('Debe enviar la fecha')

const validator = {
  auth: {
    login: [
      BODY_USERNAME_REQUIRED,
      BODY_PASSWORD_REQUIRED,
      validatorMiddleware
    ],

    subscribe: [
      BODY_SUBSCRIPTION_REQUIRED,
      validatorMiddleware
    ]
  },

  catalog: {
    add: [
      BODY_TYPE_REQUIRED,
      BODY_BRAND_REQUIRED,
      BODY_MODEL_REQUIRED,
      BODY_CERTIFIED_REQUIRED,
      BODY_DESCRIPTION_REQUIRED,
      validatorMiddleware
    ],
    update: [
      PARAM_ID_REQUIRED,
      validatorMiddleware
    ],
    remove: [
      PARAM_ID_REQUIRED,
      validatorMiddleware
    ]
  },
  securityElement: {
    request: [
      BODY_REQUEST,
      BODY_REQUEST_COLLABORATOR,
      BODY_REQUEST_PROPERTIES,
      BODY_REQUEST_DATE,
      validatorMiddleware
    ],
    approval: [
      BODY_APPROVED,
      validatorMiddleware
    ]
  },
  user: {
    notificationSeen: [
      body('notification_id').exists().withMessage('Debe indicar el id de la notificacion'),
      validatorMiddleware
    ],
    deactivateUser: [
      body('deactivatedReason').exists().withMessage('deactivatedReason no enviado'),
      validatorMiddleware
    ],
    create: [
      body('legajo').exists().withMessage('Datos obligatorios no enviados'),
      body('dni').exists().withMessage('Datos obligatorios no enviados'),
      body('cuil').exists().withMessage('Datos obligatorios no enviados'),
      body('name').exists().withMessage('Datos obligatorios no enviados'),
      body('lastname').exists().withMessage('Datos obligatorios no enviados'),
      validatorMiddleware
    ],
    editCredentials: [
      // body('user_type').exists(),
      validatorMiddleware
    ]
  },
  checklist: {
    check: [
      BODY_CHECK_ID_REQUIRED,
      BODY_CHECK_VALUE_REQUIRED,
      validatorMiddleware
    ],
    comment: [
      BODY_CHECK_ID_REQUIRED,
      BODY_CHECK_COMMENT_REQUIRED,
      BODY_CHECKLIST_ID_REQUIRED,
      validatorMiddleware
    ],
    observation: [
      BODY_CHECK_OBSERVATION_REQUIRED,
      validatorMiddleware
    ],
    pdf: [
      QUERY_DATE_REQUIRED,
      validatorMiddleware
    ]
  },
  supervisionPart: {
    hour: [
      BODY_CHECK_ID_REQUIRED,
      BODY_CHECK_VALUE_REQUIRED,
      validatorMiddleware
    ],
    comment: [
      BODY_CHECK_ID_REQUIRED,
      BODY_CHECK_COMMENT_REQUIRED,
      BODY_CHECKLIST_ID_REQUIRED,
      validatorMiddleware
    ],
    observation: [
      BODY_CHECK_OBSERVATION_REQUIRED,
      validatorMiddleware
    ],
    pdf: [
      QUERY_DATE_REQUIRED,
      validatorMiddleware
    ]
  },
  staffNews: {
    create: [
      body('news').exists(),
      body('news.type').exists(),
      validatorMiddleware
    ],
    update: [
      body('news').exists(),
      validatorMiddleware
    ],
    exculpatory: [
      body('news.staffNewId').exists().withMessage('Debe enviar el colaborador , el id de la novedad y el descargo'),
      body('news.exculpatory').exists(),
      validatorMiddleware
    ]
  },
  eventsTimeline: {
    archive: [
      body('eventsTimelineId').exists(),
      validatorMiddleware
    ],
    removeEvent: [
      body('eventsTimelineId').exists(),
      body('eventId').exists(),
      validatorMiddleware
    ]
  },
  staffRequest: {
    license: {
      create: [
        body('collaboratorId').exists().withMessage('collaboratorId'),
        validatorMiddleware
      ]
    },
    extraHours: {
      create: [
        body('extraHoursRequest.days').exists().withMessage('dias no enviados'),
        body('extraHoursRequest.time').exists().withMessage('time no enviado'),
        body('extraHoursRequest.collaborators').exists().withMessage('colaborador no enviado'),
        validatorMiddleware
      ]
    },
    leave: {
      create: [
        body('leaveRequest.type').exists().withMessage('tipo no enviado'),
        body('leaveRequest.days').exists().withMessage('dias no enviados'),
        body('leaveRequest.time').exists().withMessage('time no enviado'),
        body('leaveRequest.collaborators').exists().withMessage('colaborador no enviado'),
        validatorMiddleware
      ]
    },
    shiftChange: {
      create: [
        body('shiftRequest.toShift').exists().withMessage('turno no enviados'),
        body('shiftRequest.collaborators').exists().withMessage('colaborador no enviado'),
        validatorMiddleware
      ]
    }
  },
  sanction: {
    create: [
      body('sanction.collaborators').exists().withMessage('Colaboradores no enviados'),
      body('sanction.type').exists().withMessage('Tipo no enviado'),
      body('sanction.reason').exists().withMessage('Razon no enviado'),
      validatorMiddleware
    ]
  }

}

module.exports = validator
