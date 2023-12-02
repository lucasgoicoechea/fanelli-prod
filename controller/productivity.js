const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const scheduler = require('node-schedule')
const productivityService = require(path.join(__dirname, '../service')).productivity
const AppError = require(path.join(__dirname, '../libs/error')).AppError
const Const = require(path.join(__dirname, '/../libs/const'))
const controller = {

  /**
   * @apiDefine createProductivityper_page
   * @apiParam {Object} productivity Productivity Object
   * @apiParam {String[]} productivity.collaborators Array containing collaborators ids
   * @apiParam {String} productivity.type Productivity type (INDIVIDUAL | GROUP)
   * @apiParam {String} productivity.description Productivity description
   * @apiParam {String[]} productivity.recommendations Productivity recommendations
   * @apiParam {Date} productivity.date Productivity date
   *
   */
  create: async(function (req, res) {
    let productivity = {
      collaborators: req.body.productivity.collaborators,
      editors: req.body.productivity.editors,
      creator: req.user.id,
      type: req.body.productivity.type,
      frecuency: req.body.productivity.frecuency,
      dates: req.body.productivity.dates,
      date: req.body.productivity.date,
      dateFrom: req.body.productivity.dateFrom,
      recommendations: req.body.productivity.recommendations,
      weeklys: req.body.productivity.weeklys,
      names: req.body.productivity.names,
      description: req.body.productivity.description,
      time: req.body.productivity.time
    }
    productivity = awaitFor(productivityService.create(productivity))
    res.json({success: true, productivity})
  }),
  getPdf: async(function (req, res, next) {
    try {
      const pdfStream = awaitFor(productivityService.getPdf(req.params.id))
      pdfStream.pipe(res)
      res.contentType('application/pdf')
      pdfStream.end()
    } catch (error) {
      next(error)
    }
  }),
  getDoneTo: async(function (req, res, next) {
    let productivitys
    productivitys = awaitFor(productivityService.listMyProductivitys(req.query.userId, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    res.json({success: true, productivitys})
  }),
  getAllDoneTo: async(function (req, res, next) {
    let productivitys
    productivitys = awaitFor(productivityService.listMyProductivitysAll(req.query.userId, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    res.json({success: true, productivitys})
  }),
  getAllPassTo: async(function (req, res, next) {
    let productivitys
    var idus = req.query.userId;
    productivitys = awaitFor(productivityService.listMyProductivitysAllPass(idus, {
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
      }))
    res.json({success: true, productivitys})
  }),
  getAllPassMe: async(function (req, res, next) {
    let productivitys
    var idus = req.user.id;
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      productivitys = awaitFor(productivityService.list({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    }else {
     productivitys = awaitFor(productivityService.listMyProductivitysAllPass(idus, {
        perPage: req.query.per_page,
        page: req.query.page,
        date: req.query.date,
        type: req.query.type,
        frecuency: req.query.frecuency
        })) 
    }
    res.json({success: true, productivitys})
  }),
  getById: async(function (req, res) {
    const productivity = awaitFor(productivityService.getById(req.params.id))
    res.json({success: true, productivity})
  }),
  listMyProductivitys: async(function (req, res, next) {
    let productivitys
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      productivitys = awaitFor(productivityService.list({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    } else {
      productivitys = awaitFor(productivityService.listMyProductivitys(req.user.id, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    }
    res.json({success: true, productivitys})
  }),
  listMyProductivitysCalendar: async(function (req, res, next) {
    let productivitys
    let mes = Const.MEETING_MONTH_READBLE[req.query.month]
    let anio = req.query.year
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      productivitys = awaitFor(productivityService.listMyProductivitysMonth(null, mes, anio, {
        perPage: req.query.per_page, 
        page: req.query.page, 
        teamOf: req.user.id
      }))
    } else {
      productivitys = awaitFor(productivityService.listMyProductivitysMonth(req.user.id, mes, anio, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    }

    let resList = []
    for (var n = 1; n < 32; n++) {
      resList[n]={
        day : n,
        productivitys: []
      }
    }
    productivitys.forEach(c => {
      let productivityrepro = awaitFor(productivityService.getByIdOrigin(c._id))
      if (c.type === 'FRECUENCY'){
        let frecuentcia = c.type === 'FRECUENCY'?Const.MEETING_FRECUENCY[c.frecuency]:Const.READABLE_MEETING_TYPE[c.type]
        let description = frecuentcia + '-' + c.names
        resList[c.date.getUTCDate()].productivitys.push(
          { 
            _id: c._id,
            state: c.state,
            type: c.type,
            frecuency: frecuentcia,
            date: c.date,
            time: c.time,
            creator: c.creator,
            dateFrom: c.dateFrom,
            description: description,
            names: c.names,
            weeklys: c.weeklys,
            recommendations: c.recommendations,
            collaborators: c.collaborators,
            repro: productivityrepro
          }
        )  
      }
    })
    res.json({success: true, productivitys: resList})
  }),
  listMyProductivitysSector: async(function (req, res, next) {
    let productivitys
    let mes = Const.MEETING_MONTH_READBLE[req.query.month]
    let anio = req.query.year
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      productivitys = awaitFor(productivityService.listMyProductivitysMonth(null, mes, anio, {
        perPage: req.query.per_page, 
        page: req.query.page, 
        teamOf: req.user.id
      }))
    } else {
      productivitys = awaitFor(productivityService.listMyProductivitysMonth(req.user.id, mes, anio, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    }
    let resList = []
    productivitys.forEach(c => {
      let productivityrepro = awaitFor(productivityService.getByIdOrigin(c._id))
      if (c.type === 'FRECUENCY'){
        let frecuentcia = c.type === 'FRECUENCY'?Const.MEETING_FRECUENCY[c.frecuency]:Const.READABLE_MEETING_TYPE[c.type]
        resList.push(
          {
            _id: c._id,
            state: c.state,
            type: c.type,
            frecuency: frecuentcia,
            date: c.date,
            time: c.time,
            creator: c.creator,
            dateFrom: c.dateFrom,
            description: c.description,
            names: c.names,
            weeklys: c.weeklys,
            recommendations: c.recommendations,
            collaborators: c.collaborators,
            repro: productivityrepro
          }
        )  
      }
    })
    res.json({success: true, productivitys: resList})
  }),
  listMyProductivitysManager: async(function (req, res, next) {
    let productivitys
    if (Const.ROLE.JEFES.includes(req.user.user_type) || req.user.user_type === Const.USER_TYPE.RRHH) {
      productivitys = awaitFor(productivityService.list({perPage: req.query.per_page, page: req.query.page, teamOf: req.user.id}))
    } else {
      productivitys = awaitFor(productivityService.listMyProductivitys(req.user.id, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    }
    let resList = []
    productivitys.forEach(c => {
      let productivityrepro = awaitFor(productivityService.getByIdOrigin(c._id))
      let frecuentcia = c.type === 'FRECUENCY'?Const.MEETING_FRECUENCY[c.frecuency]:Const.READABLE_MEETING_TYPE[c.type]
      resList.push(
        {
          _id: c._id,
          state: c.state,
          type: c.type,
          frecuency: frecuentcia,
          date: c.date,
          creator: c.creator,
          dateFrom: c.dateFrom,
          description: c.description,
          names: c.names,
          weeklys: c.weeklys,
          recommendations: c.recommendations,
          collaborators: c.collaborators,
          repro: productivityrepro
        }
      )
    })
    res.json({success: true, productivitys: resList})
  }),
  getActiveByMe: async(function (req, res) {
    const productivitys = awaitFor(productivityService.getActiveByUser(req.user.id, {
      perPage: req.query.per_page,
      page: req.query.page
    }, {collaborator: req.query.collaborator, date: req.query.date, teamOf: req.user.id}))
    res.send({success: true, requests: productivitys})
  }),
  listMyProductivitysNotPassed: async(function (req, res, next) {
    let productivitys
    productivitys = awaitFor(productivityService.listMyProductivitys(req.query.userId, {
        perPage: req.query.per_page,
        page: req.query.page
      }))
    res.json({success: true, productivitys})
  }),
  remove: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !productivityService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible delete', 'No se puede eliminar', Const.ERROR.DOCUMENT_CANT_BE_REMOVED))
    }
    awaitFor(productivityService.remove(req.params.id))
    res.json({success: true, message: 'Reunion eliminada'})
  }),
  removeAll: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !productivityService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible delete', 'No se puede eliminar', Const.ERROR.DOCUMENT_CANT_BE_REMOVED))
    }
    awaitFor(productivityService.removeAll(req.params.id))
    res.json({success: true, message: 'Reunion eliminada'})
  }),
  /**
   * @apiDefine editProductivity
   * @apiParam {Object} productivity Productivity Object
   * @apiParam {String} [productivity.description] productivity description
   * @apiParam {String[]} [productivity.collaborators] Array containing collaborators ids
   * @apiParam {String[]} [productivity.recommendations] productivity recommendations
   * @apiParam {String} [productivity.type] productivity type
   * @apiParam {Date} [productivity.date]  Productivity date
   * @apiParam {Date} [productivity.dateFrom]  Productivity dateFrom
   * @apiParam {Time} [productivity.time]  Productivity time
   * @apiParam {String} [productivity.frecuency] productivity frecuency
   * @apiParam {String[]} [productivity.weeklys] productivity weeklys
   * @apiParam {String[]} [productivity.names] productivity names
   * 
   */
  edit: async(function (req, res, next) {
    if (!Const.ROLE.JEFES.includes(req.user.user_type) && !Const.USER_TYPE.RRHH === req.user.user_type && !productivityService.isCreator(req.user.id, req.params.id)) {
      return next(new AppError('Impossible to edit', 'No se puede editar', Const.ERROR.DOCUMENT_CANT_BE_EDITED))
    }
    if (req.body.productivity.state == null){
      req.body.productivity.state = 2
    }
    let productivity = {
      collaborators: req.body.productivity.collaborators,
      editors: req.body.productivity.editors,
      type: req.body.productivity.type,
      date: req.body.productivity.date,
      dates: req.body.productivity.dates,
      recommendations: req.body.productivity.recommendations,
      description: req.body.productivity.description,
      frecuency: req.body.productivity.frecuency,
      dateFrom: req.body.productivity.dateFrom,
      weeklys: req.body.productivity.weeklys,
      names: req.body.productivity.names,
      state: req.body.productivity.state,
      time: req.body.productivity.time
    }
    let repeatEdit = req.body.productivity.repeatEdit || false
    productivity = awaitFor(productivityService.edit(req.params.id, productivity,repeatEdit))
    res.json({success: true, productivity})
  })
}

function initExecuted () {
  return async(function () {
    let productivityss = awaitFor(productivityService.listAllPass({}))
    //filtramos las programadas = 0 
    productivityss = productivityss.where('state').equals(0)
    //las pasamos a ejecutadas  = 1
    productivityss.forEach(productivity => {
      productivity.state = 1
      productivity = awaitFor(productivityService.edit(productivity._id, productivity,false))
    })
  })
}


//  Run this scripts at 24:00
scheduler.scheduleJob('0 24 * * *', initExecuted())

module.exports = controller
