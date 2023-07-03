'use strict'
const path = require('path')
const SecurityElementsModel = require(path.join(__dirname, '/../model')).securityElement
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const config = require(path.join(__dirname, '/../config'))
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const dateFns = require('date-fns')
const Boom = require('boom')
const ObjectId = require('mongoose').Types.ObjectId
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const securityElementService = require(path.join(__dirname, '../service')).securityElement
const constant = require(path.join(__dirname, '../libs/const'))
const teamService = require(path.join(__dirname, '../service')).team
const NOTIFICATIONS_TYPES = constant.NOTIFICATION_TYPE
const ROLE = constant.ROLE

const createNotification = async(function (securityElement) {

  let payload = new notification.Payload(
    'Nueva solicitud de EPP',
    '/epp/' + securityElement._id,
    NOTIFICATIONS_TYPES.EPP,
    {
      subType: 'PENDING',
      supervisor: {name: securityElement.supervisor.name, lastname: securityElement.supervisor.lastname},
      collaborator: {name: securityElement.collaborator.name, lastname: securityElement.collaborator.lastname}
    })

  const bosses = awaitFor(teamService.bossesChainOf(securityElement.collaborator))

  notification.scheduleNotification(
    config.EPP_EDIT_WINDOW,
    {_id: {$in: bosses}},
    payload
  )
})

/**
 * WARNING this was done by a junior and inexperienced developer (only 4 months) so take care if you want to re used this code
 * if you have more experience i recommend you to not use this code in case you have to do some similar functionality but you can use the idea behind the code
 * this code was somewhat refactored some months after being written so it was improved
 */
const controller = {
  getById: async(function (req, res) {
    let securityElement = awaitFor(SecurityElementsModel.findOne({_id: req.params.id})
      .populate('collaborator', ['name', 'lastname'])
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname']))
    // Mongoose method not available after toObject()
    const isEditable = securityElement.isEditable()
    securityElement = securityElement.toObject()
    securityElement.isEditable = isEditable

    res.json({
      success: true,
      request: securityElement
    })
  }),

  get: async(function (req, res) {
    const securityElements = awaitFor(SecurityElementsModel.find())
    res.send({success: true, requests: securityElements})
  }),

  getActiveByMe: async(function (req, res) {
    const securityElements = awaitFor(securityElementService.getActiveByUser(req.user.id, {
      perPage: req.query.per_page,
      page: req.query.page
    }, {collaborator: req.query.collaborator, date: req.query.date, teamOf: req.user.id}))
    res.send({success: true, requests: securityElements})
  }),

  getHistoryByMe: async(function (req, res) {
    const securityElements = awaitFor(securityElementService.getHistoryByUser(req.user.id, {
      perPage: req.query.per_page,
      page: req.query.page
    }, {
      collaborator: req.query.collaborator,
      date: req.query.date,
      teamOf: req.user.id
    }))
    res.send({success: true, requests: securityElements})
  }),
  getDoneTo: async(function (req, res) {
    let page = req.query.page || 1
    let perPage = req.query.per_page || 15
    let offset = (page - 1) * perPage
    offset = Number(offset)
    perPage = Number(perPage)
    const securityElements = awaitFor(SecurityElementsModel
      .find({collaborator: req.params.id, approved: true})
      .sort({request_date: -1})
      .skip(offset)
      .limit(perPage)
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname'])
    )
    res.send({success: true, requests: securityElements})
  }),

  getSolved: async(function (req, res) {
    let page = req.query.page || 1
    let perPage = req.query.per_page || 15
    let offset = (page - 1) * perPage
    offset = Number(offset)
    perPage = Number(perPage)
    let requests = awaitFor(SecurityElementsModel.find({resolved: true, delivered: false})
      .skip(offset)
      .limit(perPage)
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname'])
    )
    res.json({
      success: true,
      requests: requests
    })
  }),

  getDelivered: async(function (req, res) {
    const filters = {}
    if (req.query.collaborator) {
      filters.collaborator = req.query.collaborator
    }
    if (req.query.date) {
      filters.date = req.query.date
    }
    if (!ROLE.SECTOR_PANOL.includes(req.user.user_type)) {
      filters.teamOf = req.user.id
    }

    const requests = awaitFor(securityElementService.getDelivered({
      page: req.query.page,
      perPage: req.query.perPage
    }, filters))
    res.json({
      success: true,
      requests: requests
    })
  }),

  getPendingResolution: async(function (req, res) {
    let page = req.query.page || 1
    let perPage = req.query.per_page || 15
    let offset = (page - 1) * perPage
    offset = Number(offset)
    perPage = Number(perPage)
    let requests = awaitFor(SecurityElementsModel.find({approved: true, resolved: false})
      .skip(offset)
      .limit(perPage)
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname'])
      .populate('collaborator', ['name', 'lastname'])
    )
    res.json({
      success: true,
      requests: requests
    })
  }),

  request: async(function (req, res) {
    let request = req.body.request
    request.supervisor = req.user.id
    //  For sizes auto-complete
    // FIX save re-hashes the password
    /*
    let employee = awaitFor(userModel.findOne({_id: req.body.request.collaborator}))
    _.filter(request.items, item => item.size)
      .forEach((item) => {
        let size = _.find(employee.sizes, size => size.item_description === item.description)
        if (size !== undefined) {
          size.item_size = item.size
        } else {
          employee.sizes.push({item_description: item.description, item_size: item.size})
        }
      })

    employee.save()
    */
    // save request
    let securityElement = awaitFor(SecurityElementsModel.create(request))

    if (ROLE.JEFES.includes(req.user.user_type)) {
      securityElement = awaitFor(securityElement
        .populate('collaborator', ['name', 'lastname', 'security_element_requests', 'security_element_items'])
        .populate('supervisor', ['name', 'lastname'])
        .populate('approved_by', ['name', 'lastname'])
        .execPopulate())

      securityElement = setApproval(securityElement, true, req.user.id)

      let payload = new notification.Payload('Nuevo pedido de seguridad', '/panol/solicitudes', NOTIFICATIONS_TYPES.EPP, {
        subType: 'APPROVED',
        collaborator: {name: securityElement.collaborator.name, lastname: securityElement.collaborator.lastname},
        supervisor: {name: securityElement.supervisor.name, lastname: securityElement.supervisor.lastname},
        approvedBy: {name: securityElement.approved_by.name, lastname: securityElement.approved_by.lastname}
      })
      notification.sendNotification(
        {user_type: {$in: ROLE.SECTOR_PANOL}},
        payload
      )
    } else {
      securityElement = awaitFor(securityElement.populate('supervisor', ['name', 'lastname']).populate('collaborator', ['name', 'lastname']).execPopulate())
      createNotification(securityElement)
    }
    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        request: securityElement,
        idempotencyKey: idempotencyKey
      })
    } else {
      res.json({success: true, request: securityElement})
    }
  }),

  update: async(function (req, res, next) {
    let newSecurityElement = req.body.request
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('Solicitud inexistente'))
      return
    }
    let securityElement = awaitFor(SecurityElementsModel.findOne({_id: req.params.id, supervisor: req.user.id}))
    if (securityElement === null) {
      next(Boom.notFound('Solicitud inexistente'))
      return
    }
    if (securityElement.isEditable()) {
      newSecurityElement.request_date = securityElement.request_date
      newSecurityElement = awaitFor(SecurityElementsModel.findOneAndUpdate({_id: req.params.id}, {$set: newSecurityElement}, {new: true}))
      // TODO use express mung or find way to use headers in workbox
      const idempotencyKey = req.get('Idempotency-Key')
      if (idempotencyKey !== undefined) {
        res.json({
          success: true,
          request: newSecurityElement,
          idempotencyKey: idempotencyKey
        })
      } else {
        res.json({success: true, request: newSecurityElement})
      }
    } else {
      next(new AppError('Not editable', 'Ya ha pasado el tiempo de edición'))
    }
  }),

  approval: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('ID inválido'))
      return
    }
    let securityElement = awaitFor(SecurityElementsModel.findOne({_id: req.params.id})
      .populate('collaborator', ['name', 'lastname', 'security_element_requests', 'security_element_items'])
      .populate('supervisor', ['name', 'lastname']))
    if (securityElement === null) {
      next(Boom.notFound('Solicitud inexistente'))
      return
    }
    securityElement = setApproval(securityElement, req.body.approved, req.user.id)
    if (securityElement.approved) {
      notification.sendNotification(
        {user_type: {$in: ROLE.SECTOR_PANOL}},
        new notification.Payload('Nuevo pedido de seguridad aprobado', '/panol/solicitudes', NOTIFICATIONS_TYPES.EPP, {
          subType: 'APPROVED',
          collaborator: {name: securityElement.collaborator.name, lastname: securityElement.collaborator.lastname},
          supervisor: {name: securityElement.supervisor.name, lastname: securityElement.supervisor.lastname},
          approvedBy: {name: securityElement.approved_by.name, lastname: securityElement.approved_by.lastname}
        })
      )
    } else {
      notification.sendNotification(
        {$or: [{_id: securityElement.supervisor}]},
        new notification.Payload('Solicitud rechazada', '/epp/' + securityElement._id, NOTIFICATIONS_TYPES.EPP, {
          subType: 'REJECTED',
          collaborator: {name: securityElement.collaborator.name, lastname: securityElement.collaborator.lastname},
          supervisor: {name: securityElement.supervisor.name, lastname: securityElement.supervisor.lastname},
          approvedBy: {name: securityElement.approved_by.name, lastname: securityElement.approved_by.lastname}
        })
      )
    }
    let message = req.body.approved ? 'Solicitud aprobada' : 'Solicitud rechazada'
    res.json({success: true, message: message, request: securityElement})
  }),

  getPdf: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let securityElement = awaitFor(SecurityElementsModel
      .findOne({
        _id: req.params.id,
        approved: true
      })
      .populate('collaborator')
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname']))
    if (securityElement === null) {
      next(Boom.notFound('Solicitud inexistente'))
      return
    }
    let pdfContent = pdf.getSecurityElementContent(securityElement.collaborator, securityElement)
    let pdfStream = pdf.createPdf(pdfContent)
    pdfStream.pipe(res)
    if (securityElement.resolved !== true) {
      let payload = new notification.Payload('Pedido listo', '/epp/' + securityElement._id, NOTIFICATIONS_TYPES.EPP, {
        subType: 'RESOLVED',
        collaborator: {name: securityElement.collaborator.name, lastname: securityElement.collaborator.lastname},
        supervisor: {name: securityElement.supervisor.name, lastname: securityElement.supervisor.lastname},
        approvedBy: {name: securityElement.approved_by.name, lastname: securityElement.approved_by.lastname}

      })
      securityElement.set({resolved: true})
      notification.sendNotification(
        {_id: securityElement.supervisor},
        payload
      )
      securityElement.save()
    }
    else {
      securityElement.set({printed: true})
      securityElement.save()
    }
    res.contentType('application/pdf')
    pdfStream.end()
  }),

  delivered: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let securityElement = awaitFor(SecurityElementsModel.findOne({
      _id: req.params.id,
      resolved: true
    })
      .populate('collaborator', ['name', 'lastname'])
      .populate('supervisor', ['name', 'lastname'])
      .populate('approved_by', ['name', 'lastname']))

    if (securityElement === null) {
      next(Boom.notFound('Solicitud inexistente'))
      return
    }
    securityElement.set({delivered: req.body.delivered})
    let payload = new notification.Payload('Pedido entregado', '/epp/' + securityElement._id, NOTIFICATIONS_TYPES.EPP, {
      subType: 'DELIVERED',
      collaborator: {name: securityElement.collaborator.name, lastname: securityElement.collaborator.lastname},
      supervisor: {name: securityElement.supervisor.name, lastname: securityElement.supervisor.lastname}
    })
    notification.sendNotification(
      {_id: securityElement.supervisor},
      payload
    )
    securityElement = awaitFor(securityElement.save())
    res.json({success: true, request: securityElement})
  }),

  getActive: async(function (req, res) {
    const securityElements = awaitFor(securityElementService.getActive({
      perPage: req.query.per_page,
      page: req.query.page,
      teamOf: req.user.id
    }))
    res.send({success: true, securityElements: securityElements})
  })

}

function setApproval (securityElement, approval, approver) {
  securityElement.set({approved: approval})
  securityElement.set({approved_by: approver})
  securityElement.set({collaborator_request: securityElement.collaborator.security_element_requests})
  securityElement.set({number_request: securityElement.collaborator.security_element_items})
  if (approval) {
    securityElement.set({global_request_counter: awaitFor(SecurityElementsModel.count({approved: true})) + 1})
  }
  securityElement = awaitFor(securityElement.save())
  securityElement.collaborator.set({security_element_requests: securityElement.collaborator.security_element_requests + 1})
  securityElement.collaborator.set({security_element_items: securityElement.collaborator.security_element_items + securityElement.items.length})
  securityElement.collaborator.save()
  securityElement = awaitFor(SecurityElementsModel.populate(securityElement, {
    path: 'approved_by',
    select: ['name', 'lastname']
  }))
  return securityElement
}

module.exports = controller
