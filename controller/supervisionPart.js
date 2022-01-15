'use strict'
const path = require('path')
const SupervisionpartModel = require(path.join(__dirname, '/../model')).supervisionPart
const HourModel = require(path.join(__dirname, '/../model')).hour
const FailModel = require(path.join(__dirname, '/../model')).fail
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const config = require(path.join(__dirname, '/../config'))
const _ = require('lodash')
const shift = require(path.join(__dirname, '/../libs/shift'))
const scheduler = require('node-schedule')
const Boom = require('boom')
const Bluebird = require('bluebird')
const AppError = require(path.join(__dirname, '/../libs/error')).AppError
const winston = require('winston')
const ObjectId = require('mongoose').Types.ObjectId
const notification = require(path.join(__dirname, '/../libs/notification'))
const constant = require(path.join(__dirname, '../libs/const'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const excel = require(path.join(__dirname, '../libs/excel'))
const USER_TYPE = constant.USER_TYPE
const NOTIFICATIONS_TYPE = constant.NOTIFICATION_TYPE
//duracion turno mas 5 minutos
const SHIFT_DURATION_MS = constant.SHIFT_DURATION_MS + (1000 * 60 * 5)
const ONE_HOUR_MS = constant.ONE_HOUR_MS
const SECTORS = Object.getOwnPropertyNames(constant.CHECKS_SECTOR).map(s => constant.CHECKS_SECTOR[s])

/**
 * WARNING this was done by a junior and inexperienced developer (only 4 months) so take care if you want to re used this code
 * if you have more experience i recommend you to not use this code in case you have to do some similar functionality but you can use the idea behind the code
 *
 */
const controller = {
  add: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.supervisionpart.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let now = new Date()
    //let check = awaitFor(CheckModel.findById(req.body.check.id))
    //if (check === null) return next(Boom.notFound('Check inexistente'))
    //let sector = check.sector
    let supervisionpartTmp = awaitFor(SupervisionpartModel
      .findById(req.body.supervisionpart.id)
      //.populate({path: 'checks.check', model: 'Checks'})
    )
    if (supervisionpartTmp === null) return next(Boom.notFound('SupervisionPart inexistente'))
    //check = _.find(checklist.checks, c => c.check._id.toString() === req.body.check.id.toString())
    let value = {
      supervisor: req.user.id,
      value: req.body.supervisionpart.value,
      date: now,
      totals: [],
      materials: []
      //extra: req.body.check.extra ? req.body.check.extra : undefined
    }

    //  if it's the first value of the checklist
    if (supervisionpartTmp.supervisor === undefined) {
      supervisionpartTmp.set({supervisor: req.user.id})
      winston.log('debug', 'Primer valor de la supervision', supervisionpartTmp.sector)
      notification.clearNotification(supervisionpartTmp.sector + '-must-create-reminder')
    }

    //raro guardadno una hora vacia
    /* if (supervisionpartTmp.hours.length < 8) {
      supervisionpartTmp.hours.push(value)
    }*/
    
    supervisionpartTmp = awaitFor(supervisionpartTmp.save())

    awaitFor(updateReminders(supervisionpartTmp.hours, sector))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionpart: supervisionpartTmp,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionpart: supervisionpartTmp})
    }
  }),

  addObservation: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname']))
    supervisionPart.observations.push({observation: req.body.observation.observation, supervisor: req.user.id})
    supervisionPart = awaitFor(supervisionPart.save())
    // res.json({success: true, checklist: checklist})
    supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname']))
    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),

  addComment: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id) || !ObjectId.isValid(req.body.observation.hour_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
    let hour = supervisionPart.hours.find( cv => cv.hour._id.toString() === req.body.observation.hour_id.toString())
    
    hour.comments.push({comment: req.body.observation.observation, supervisor: req.user.id})
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),
  removeRepositionPallet: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
    let repositionpallet = _.find(supervisionPart.repositionPallets, c => c._id.toString() === req.body.observation.reposition_pallet_id.toString())
    if (repositionpallet != null){
      repositionpallet.remove();
    }
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),  
  addRepositionPallet: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
    //suma material total para la hora
    let materialTotal = getMaterial(supervisionPart.repositionPallets,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material],supervisionPart.sector)
    if (materialTotal == null) {  
      supervisionPart.repositionPallets.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: req.body.observation.value, number: 1})
    }
    else {
      materialTotal.count = materialTotal.count + eval(req.body.observation.value)
    }
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),   
  addMaterial: async(function (req, res, next) {

    if (!ObjectId.isValid(req.body.observation.supervisionpart_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = updateMaterialsAndCalculatedTotal(req)

    supervisionPart = completeCalculatedTotalData(supervisionPart)
     
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),
  removeStopping: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id) || !ObjectId.isValid(req.body.observation.stopping_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
      let stopping =  null
      supervisionPart.hours.find ( h =>  stopping =  h.stoppings.find( 
                                                      mv => 
                                                      mv._id.toString() === req.body.observation.stopping_id.toString()
                                                                    )
                                          );
      if (stopping != null) {
        //borra y resta al tiempo total de paras
        supervisionPart.totalStoppings = supervisionPart.totalStoppings - stopping.minutes
        stopping.remove()
      }
   supervisionPart = awaitFor(supervisionPart.save())
   supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),
  removeMaterial: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id) || !ObjectId.isValid(req.body.observation.material_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
    let material = supervisionPart.materials.find( mv => mv._id.toString() === req.body.observation.material_id.toString())
      if (material != null) {
        //borra y resta material total para la hora
        let materialTotal = getMaterial(supervisionPart.totals,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],material.material,supervisionPart.sector)
        if (materialTotal != null) {
          materialTotal.remove()
        }
        material.remove()
      }
   

    //suma total hora
    supervisionPart = completeCalculatedTotalData(supervisionPart)
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),

  removeVagon: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id) || !ObjectId.isValid(req.body.observation.material_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
    let material = supervisionPart.materials.find( mv => mv._id.toString() === req.body.observation.material_id.toString())
      if (material != null) {
        //borra y resta material total para la hora
        const posSelected = material.vagons.findIndex(c => c.number === req.body.observation.vagon_number)
        
  
        //resta material total para la hora
        if (supervisionPart.sector == 'EXTRUSORA') {
         let materialTotal = getMaterial(supervisionPart.totals,material.machine,material.material,supervisionPart.sector)
          //si es la ultima vagoneta tieneq  descontar
          if (materialTotal != null && posSelected  ===  material.vagons.length - 1 ) {
            //si es la unica descuenta entera
            if (material.vagons.length == 1){
              materialTotal.count = materialTotal.count - material.vagons[posSelected].count
              materialTotal.number = materialTotal.number - material.vagons[posSelected].count
            } //sino descuenta con la diferencia de la anterior
            else {
              let preLastVagon = material.vagons[material.vagons.length - 2]
              materialTotal.count = preLastVagon.count//materialTotal.count - (material.vagons[posSelected].count - preLastVagon.count)
              materialTotal.number = preLastVagon.count//materialTotal.number - (material.vagons[posSelected].count - preLastVagon.count)
            }
          }
          // y actualizar el last con la atnerior
          let last = supervisionPart.last
          if (last != null && last.material == material.material && material.machine == last.machine){
            supervisionPart.last = {machine: material.machine, 
                material: material.material, count: materialTotal.count,
                number: materialTotal.number} 
          }
        }
        else {
          let materialTotal = getMaterial(supervisionPart.totals,constant.SUPERVISION_PART_MACHINE_READBLE["M750"],material.material,supervisionPart.sector)
          if (materialTotal != null) {
            if (supervisionPart.sector == 'APILADORA') {
              let pisos = constant.SUPERVISION_PART_MATERIAL_FLOORS[material.material]
              materialTotal.count = materialTotal.count - ( material.vagons[posSelected].count / pisos )
            }
            if (supervisionPart.sector == 'DESAPILADORA') {
              materialTotal.count = materialTotal.count - 1
            }
          }
        }
        material.vagons.splice(posSelected, 1)

      }
   

    //suma total hora
    supervisionPart = completeCalculatedTotalData(supervisionPart)
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),
  addVagon: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id) || !ObjectId.isValid(req.body.observation.material_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = updateMaterialsAndCalculatedTotal(req)

    //suma total hora
    supervisionPart = completeCalculatedTotalData(supervisionPart)
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),
  addStopping: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.observation.supervisionpart_id) || !ObjectId.isValid(req.body.observation.hour_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('hours.values.supervisor', ['name', 'lastname'])
      .populate('last.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname']))
    let hour = supervisionPart.hours.find( cv => cv.hour._id.toString() === req.body.observation.hour_id.toString())
    
    hour.stoppings.push({fail: req.body.observation.fail_id, minutes: req.body.observation.minutes, comment: req.body.observation.comment, supervisor: req.user.id})
    supervisionPart = completeCalculatedTotalData(supervisionPart)
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart =  awaitFor(SupervisionpartModel
      .findById(req.body.observation.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),
  
  updateTotals: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.totals.supervisionpart_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.totals.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    supervisionPart.totalRepositionPallet = req.body.totals.totalRepositionPallet
    supervisionPart.totalUnitsMachine = req.body.totals.totalUnitsMachine
    supervisionPart.totalDownloadedEstanterias = req.body.totals.totalDownloadedEstanterias
    supervisionPart.totalMinutesWithoutStopping = req.body.totals.totalMinutesWithoutStopping
    supervisionPart.totalCountUnitMaterials = req.body.totals.totalCountUnitMaterials
    supervisionPart.totalBobin = req.body.totals.totalBobin
    supervisionPart.totalBobinTwo = req.body.totals.totalBobinTwo
    supervisionPart.totalPalletsCamara = req.body.totals.totalPalletsCamara
    supervisionPart.totalPalletsContador = req.body.totals.totalPalletsContador
    supervisionPart.total_MOLDE_8 = req.body.totals.total_MOLDE_8
    supervisionPart.total_MOLDE_12_6A = req.body.totals.total_MOLDE_12_6A
    supervisionPart.total_MOLDE_12_8A = req.body.totals.total_MOLDE_12_8A
    supervisionPart.total_MOLDE_18 = req.body.totals.total_MOLDE_18
    supervisionPart.total_MOLDE_P12 = req.body.totals.total_MOLDE_P12
    supervisionPart.total_MOLDE_P18 = req.body.totals.total_MOLDE_P18
    supervisionPart.total_MOLDE_L11 = req.body.totals.total_MOLDE_L11
    supervisionPart.total_MOLDE_C = req.body.totals.total_MOLDE_C
    supervisionPart.total_MOLDE_DM4 = req.body.totals.total_MOLDE_DM4
    supervisionPart.total_MOLDE_DM20 = req.body.totals.total_MOLDE_DM20
    supervisionPart.total_MOLDE_DM24 = req.body.totals.total_MOLDE_DM24
    supervisionPart.total_MOLDE_DM27 = req.body.totals.total_MOLDE_DM27
    supervisionPart.total_MOLDE_DIN18 = req.body.totals.total_MOLDE_DIN18
    supervisionPart.total_MOLDE_DIN27 = req.body.totals.total_MOLDE_DIN27
    supervisionPart.total_MOLDE_COLUMNA = req.body.totals.total_MOLDE_COLUMNA
    supervisionPart = awaitFor(supervisionPart.save())
    // res.json({success: true, checklist: checklist})

    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),

  updateHour: async(function (req, res, next) {
    if (!ObjectId.isValid(req.body.totals.supervisionpart_id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    let supervisionPart = awaitFor(SupervisionpartModel
      .findById(req.body.totals.supervisionpart_id)
      .populate({path: 'hours.hour', model: 'Hour'})
      .populate({path: 'hours.stoppings.fail', model: 'Fail'})
      .populate('hours.hour', ['text','ordertime'])
      .populate('supervisorShift', ['name', 'lastname'])
      .populate('hours.supervisor', ['name', 'lastname'])
      .populate('creator', ['name', 'lastname'])
      .populate('hours.comments.supervisor', ['name', 'lastname'])
      .populate('observations.supervisor', ['name', 'lastname'])
      .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    let hour = supervisionPart.hours.find( cv => cv.hour._id.toString() === req.body.totals.hour_id.toString())
    hour.durity = req.body.totals.durity
    hour.vacuum = req.body.totals.vacuum
    hour.palletsCamara = req.body.totals.palletsCamara
    hour.palletsContador = req.body.totals.palletsContador
    supervisionPart = completeCalculatedTotalData(supervisionPart)
    supervisionPart = awaitFor(supervisionPart.save())
    supervisionPart = awaitFor(SupervisionpartModel
        .findById(req.body.totals.supervisionpart_id)
        .populate({path: 'hours.hour', model: 'Hour'})
        .populate({path: 'hours.stoppings.fail', model: 'Fail'})
        .populate('hours.hour', ['text','ordertime'])
        .populate('supervisorShift', ['name', 'lastname'])
        .populate('hours.supervisor', ['name', 'lastname'])
        .populate('creator', ['name', 'lastname'])
        .populate('hours.comments.supervisor', ['name', 'lastname'])
        .populate('observations.supervisor', ['name', 'lastname'])
        .populate('hours.stoppings.supervisor', ['name', 'lastname']))
    
    const idempotencyKey = req.get('Idempotency-Key')
    if (idempotencyKey !== undefined) {
      res.json({
        success: true,
        supervisionPart: supervisionPart,
        idempotencyKey: idempotencyKey,
      })
    } else {
      res.json({success: true, supervisionPart: supervisionPart})
    }
  }),

  getSupervisionparts: async(function (req, res, next) {
    let supervisionparts = awaitFor(SupervisionpartModel.find({sector: req.params.sector.toUpperCase()}))
    if (supervisionparts === null) return next(Boom.notFound('Sector inexistente'))
    res.json({success: true, supervisionparts: supervisionparts})
  }),

  /**
   * Used to send the current checklist either it's been created before or not
   */
  getCurrent: async(function (req, res, next) {
    let supervisionpart = awaitFor(getLastOrCreate(req.user.id, req.params.sector.toUpperCase()))
    if (supervisionpart === null) return next(Boom.notFound('Sector inexistente'))
    res.json({success: true, supervisionpart: supervisionpart})
  }),

  /**
   * Used to get dates in which checklists were done
   */
  datesWithSupervisionpart: async(function (req, res, next) {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000
    let dates = awaitFor(SupervisionpartModel.distinct('date', {
      'date': {
        $gte: new Date(new Date().getTime() - thirtyDays)
      }
    }))
    dates = dates.sort((d1, d2) => d2.getTime() - d1.getTime())
    dates = dates.map(d => new Date(d.toLocaleDateString()))
    res.send({success: true, dates: dates})
  }),

  get: async(function (req, res, next) {
    let page = req.query.page || 1
    let perPage = req.query.per_page || 15
    let offset = (page - 1) * perPage
    offset = Number(offset)
    perPage = Number(perPage)
    const supervisionparts = awaitFor(SupervisionpartModel.find({}, {
      sector: 1,
      _id: 1,
      date: 1,
      schedule: 1
    }).skip(offset).limit(perPage))
    res.json({success: true, supervisionparts: supervisionparts})
  }),

  getSupervisionpart: async(function (req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      next(Boom.notFound('ID Inválido'))
      return
    }
    const supervisonparts = awaitFor(SupervisionpartModel.findById(req.params.id)
    .populate({path: 'hours.hour', model: 'Hour'})
    .populate({path: 'hours.stoppings.fail', model: 'Fail'})
    .populate('hours.hour', ['text','ordertime'])
    .populate('supervisorShift', ['name', 'lastname'])
    .populate('hours.supervisor', ['name', 'lastname'])
    .populate('creator', ['name', 'lastname'])
    .populate('hours.comments.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname'])
    .populate('hours.stoppings.supervisor', ['name', 'lastname']))
     res.json({success: true, supervisonpart: supervisonparts})
  }),



  getFails: async(function (req, res, next) {
    // console.log(req.params.sector.toUpperCase())
    let fails = awaitFor(FailModel.find({sector: req.params.sector.toUpperCase()}))
    // console.log(fails)
    if (fails === null) return next(Boom.notFound('Sector inexistente'))
    res.json({success: true, fails: fails})
  }),

  summary: async(function (req, res) {
    const summaries = []
    let date
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'date it s:', {date: date, localDate: date.toLocaleString()})
    SECTORS.forEach(s => {
      summaries.push(summaryForSector(date, s))
    })
    res.json({success: true, summaries})
  }),

  comparative: async(function (req, res, next) {
    let date
    const sector = req.params.sector.toUpperCase()
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'supervisionpart date it s:', {date: date, localDate: date.toLocaleString()})

    let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
    const hours = awaitFor(HourModel.find().lean())

    // Initialize the property comparative for all checks
    hours.forEach(c => { 
      c.comparative = []
      c.sector = sector
     })
    const headers = []
    // Add the headers data (shift and schedule of the day)
    shift.dayShiftDistribution(date)
      .forEach(d => headers.push({schedule: d.schedule.value, shift: d.shift}))
    supervisionparts = _.orderBy(supervisionparts, c => c.date)

    // for all the checklist made on the day and for each check of the sector add to the comparative data the value of the current check in the current checklist
    supervisionparts.forEach(supervisonpart => {
      supervisonpart = completeCalculatedTotalData(supervisonpart)
      hours.forEach(c => c.comparative.push(supervisonpart.hours.find(cv => cv.hour._id.toString() === c._id.toString())))
       })
    

    // If there are fewer checklist than headers it's because one or more checklist where not created so we complete the missing values in the comparative array
    hours.forEach(c => completeObjectsMissing(c.comparative, {
      hour: c._id,
      sector: sector,
      comments: [],
      //materials: [],
      stoppings:[]
    }, 1 )) 
    //headers.length))
    res.json({success: true, headers, supervisionparts})
  }),

  totales: async(function (req, res, next) {
    let date
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'vengo por los totales fecha:', {date: date, localDate: date.toLocaleString()})
    const sector =  'DESAPILADORA'   
    let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
    //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
    let totalesMaterial = new Array()
    supervisionparts.forEach(supervisonpart => {
       completeTotalesMaterial(supervisonpart,totalesMaterial)
    })
    let totales = []
    totalesMaterial.forEach( total => {
        if (total != null){
          totales.push(total)
        }
    }) 
    res.json({success: true,  totales:  totales}) 
  }),

  totalesExtrusora: async(function (req, res, next) {
    let date
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'supervisionpart totalesExtrusora:', {date: date, localDate: date.toLocaleString()})
    const sector =  'EXTRUSORA'   
    let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
    //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
    let totalesMaterial = new Array()
    supervisionparts.forEach(supervisonpart => {
      totalesMaterial = completeTotalesMaterialExtrusora(supervisonpart,totalesMaterial)
    })
    
    let totales = []
    totalesMaterial.forEach( total => {
        if (total != null){
          totales.push(total)
        }
    }) 
    res.json({success: true,  totales:  totales})
  }),


  totalesApiladora: async(function (req, res, next) {
    let date
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'supervisionpart totalesApiladora:', {date: date, localDate: date.toLocaleString()})
    const sector =  'APILADORA'   
    let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
    //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
    let totalesMaterial = new Array()
    supervisionparts.forEach(supervisonpart => {
      totalesMaterial = completeTotalesMaterialApiladora(supervisonpart,totalesMaterial)
    })
    
    let totales = []
    totalesMaterial.forEach( total => {
        if (total != null){
          totales.push(total)
        }
    }) 
    res.json({success: true,  totales:  totales})
  }),


  totalesDesapiladora: async(function (req, res, next) {
    let date
    if (req.query.hasOwnProperty('date')) {
      date = new Date(new Date(req.query.date).getTime() + 1000 * 60 * 60 * 3)
    } else {
      date = new Date(new Date().toDateString())
    }
    winston.log('debug', 'supervisionpart totalesDesapiladora :', {date: date, localDate: date.toLocaleString()})
    const sector =  'DESAPILADORA'   
    let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
    //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
    let totalesMaterial = new Array()
    supervisionparts.forEach(supervisonpart => {
      totalesMaterial = completeTotalesMaterialDesapiladora(supervisonpart,totalesMaterial)
    })
    
    let totales = []
    totalesMaterial.forEach( total => {
        if (total != null){
          totales.push(total)
        }
    }) 
    res.json({success: true,  totales:  totales})
  }),

  getReportForDay: async(function (req, res, next) {
    try {
      let date
      if (req.params.day) {
        date = new Date(new Date(req.params.day).getTime() + 1000 * 60 * 60 * 3)
      } else {
        date = new Date(new Date().toDateString())
      }
      const excel = awaitFor(generateReportForDay(date))
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx')
      awaitFor(excel.xlsx.write(res))
      res.end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  })



}

function initReminders () {
  return async(function () {
    notification.clearNotification('must-complete')

    notification.clearNotification('something-bad')

    //  clears all intervals and set them to null
    // CHANGE CheckModel.SECTOR TO SECTORS
    Object.getOwnPropertyNames(SECTORS)
      .forEach(sector => {
        notification.clearNotification(sector + '-must-create-reminder')
        notification.pushNotificationEvery(
          config.CHECKLIST_REMINDER,
          {user_type: USER_TYPE.SUPERVISOR_PRODUCCION},
          new notification.Payload('Recordar crear Parte de Supervision ' + sector, '', NOTIFICATIONS_TYPE.RECORDATORIO_SUPERVISIONPART),
          1200,
          sector + '-must-create-reminder'
        )
      })
  })
}

//  Run this scripts at 6:00 , 14:00, 22:00
scheduler.scheduleJob('0 6,14,22 * * *', initReminders())

const updateReminders = async(function (hours) {
  // let versions = _.groupBy(checks, c => c.check)
  let lastVersions = _.map(hours, c => c.last)

  // if there is a notification reminder already set it doesn't create another
  //const someCheckIsFalse = _.some(lastVersions, v => v.value === false)
  const someCheckIsFalse = false
  if (someCheckIsFalse && !awaitFor(notification.notificationExists('something-bad'))) {
    winston.log('debug', 'Hay algo que corregir y no hay reminder')
    notification.pushNotificationEvery(
      config.CHECKLIST_REMINDER,
      {user_type: USER_TYPE.SUPERVISOR_PRODUCCION},
      new notification.Payload('Hay algo que corregir del Parte de Supervision', '', NOTIFICATIONS_TYPE.RECORDATORIO_SUPERVISIONPART),
      1200,
      'something-bad'
    )

    // if there is a notification reminder already set it sets it to null, because there is nothing bad
  } else if (!someCheckIsFalse) {
    winston.log('debug', 'Todo esta bien')
    notification.clearNotification('something-bad')
  }

  // let missingChecks = _.some(lastVersions, c => c.value === undefined)
  let missingChecks = false
  if (missingChecks && !awaitFor(notification.notificationExists('must-complete'))) {
    winston.log('debug', 'Faltan campos que completar del parte de supervision y no hay un reminder')
    notification.pushNotificationEvery(
      config.CHECKLIST_REMINDER,
      {user_type: USER_TYPE.SUPERVISOR_PRODUCCION},
      new notification.Payload('Faltan campos que completar del Parte de Supervision', '', NOTIFICATIONS_TYPE.RECORDATORIO_SUPERVISIONPART),
      1200,
      'must-complete'
    )
  } else if (!missingChecks) {
    winston.log('debug', 'Todo el parte de supervision esta completo')
    notification.clearNotification('must-complete')
  }
})

const generateReportForDay = async(function (date) {
  let sector =  'DESAPILADORA'   
  let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
  supervisionparts = _.orderBy(supervisionparts, c => c.date)
  //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
  let totalesMaterialDesapiladora = new Array()
  supervisionparts.forEach(supervisonpart => {
    completeTotalesMaterialDesapiladora(supervisonpart,totalesMaterialDesapiladora)
  })
  let totales = []
  totalesMaterialDesapiladora.forEach( total => {
      if (total != null){
        total.toneladas = total.toneladas==0?0:((total.toneladas/1000).toFixed(2))
        totales.push(total)
      }
  }) 
  
  sector =  'APILADORA'   
  supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
  supervisionparts = _.orderBy(supervisionparts, c => c.date)
  //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
  let totalesMaterialApiladora = new Array()
  supervisionparts.forEach(supervisonpart => {
    completeTotalesMaterialApiladora(supervisonpart,totalesMaterialApiladora)
  })
  totalesMaterialApiladora.forEach( total => {
      if (total != null){
        total.toneladas = total.toneladas==0?0:((total.toneladas/1000).toFixed(2))
        totales.push(total)
      }
  }) 
  sector =  'EXTRUSORA'   
  supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
  supervisionparts = _.orderBy(supervisionparts, c => c.date)
  //ARMO ARREGLO CLAVE=MATEIRAL Y VALOR=TONELADAS PALLETS
  let totalesMaterialExtrusora  = new Array()
  supervisionparts.forEach(supervisonpart => {
    completeTotalesMaterialExtrusora(supervisonpart,totalesMaterialExtrusora)
  })
  totalesMaterialExtrusora.forEach( total => {
      if (total != null){
        total.toneladas = total.toneladas==0?0:((total.toneladas/1000).toFixed(2))
        totales.push(total)
      }
  })
  /*const data = awaitFor(Bluebird.all([totalesMaterialExtrusora,totalesMaterialApiladora ,totalesMaterialDesapiladora])
      .reduce(
        (arr, events) => arr.concat(events),
        []
      ))*/

  //totales = _.orderBy(totales,['sector','created_at'],['desc','desc']);
  return excel.generateExcelSupervisionPartByDay(totales)
})

function updateHoursSupervisionpart (supervisionPart, schedule, user_id, now) {
  let diff = 0
  let cantHoras = 0
  // console.log(`date${now}`)
  if (schedule.value === 'NOCHE' && now.getHours() < 6) {
    now.setDate(now.getDate() - 1)
    cantHoras = now.getHours() + 3
  }
  let date = new Date(now.toDateString()).setHours(schedule.begins)
  if (cantHoras == 0) {
    diff = (now - date)
    cantHoras = Math.floor((diff / (1000 * 60 * 60)) % 24) + 1
  }
  //chequeamos si esta dentro del chagui de 5 minutos
  if (cantHoras < 9 ) {      

    // let hours = []
    let found = null
    let hoursKey = _.map(supervisionPart.hours)
    awaitFor(HourModel.find({schedule: schedule.value}).sort({ordertime: 1}).lean())
      .forEach(c => {
        if (cantHoras > 0) {
          found = _.some(hoursKey, cv => cv.hour._id.toString() === c._id.toString())
          if (!found) {
            let value = {sector: supervisionPart.sector, schedule: schedule.value, hour: c._id, supervisor: user_id}
            // Save the value and replace the last
            if (supervisionPart.hours.length > 0){ 
              /*let hourLast = supervisionPart.hours[supervisionPart.hours.length - 1]
              if (hourLast.materials.length > 0){
                value.materials = []
                value.materials.push(_.cloneDeep(hourLast.materials[hourLast.materials.length - 1]))
                let arraVagons = value.materials[value.materials.length - 1].vagons
                while (arraVagons.length) { arraVagons.pop(); }
                //value.materials[value.materials.length - 1].vagons = []
                //value.materials[value.materials.length - 1].vagons = [{ count: 0, number: 0, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]}]
              }
              value.last = hourLast.last
              if (hourLast.last != null )
              {
                value.last = {machine: value.last.machine, material: value.last.material, count: value.last.count, jumpHour: 1 }
              }
              //value.last.jumpHour=1
              if (hourLast.totals.length > 0) {
                value.totals = []
                value.totals.push(_.cloneDeep(hourLast.totals[hourLast.totals.length - 1]))
                //value.totals[value.totals.length - 1].count = 0
                //value.totals[value.totals.length - 1].number = 0
              }  */
            }
            
            supervisionPart.hours.push(value)
            //console.log('pongo en 0 totales')
            /*if (value.totals && value.totals.length > 0) {
              let totals = value.totals
              totals.forEach( tt => {
                tt.count = 0
                tt.number = 0
              })
            }*/
          }
          cantHoras = cantHoras - 1
        }
      })
  }
  // notification.clearNotification('must-complete')
  // notification.clearNotification('something-bad')
  // notification.clearNotification(sector + '-must-create-reminder')
  //console.log('estoy por guardar update hours')
  let supervisionpart = awaitFor(supervisionPart.save())
  //console.log('guardo y devuelvo')
  supervisionpart = awaitFor(SupervisionpartModel
    .populate(supervisionpart, {path: 'hours.hour', model: 'Hour'}))
  return supervisionpart
}

function createSupervisionpart (user_id, sector, schedule, now) {
  let diff = 0
  let cantHoras = 0
  // console.log(`date${now}`)
  if (schedule.value === 'NOCHE' && now.getHours() < 6) {
    now.setDate(now.getDate() - 1)
    cantHoras = now.getHours() + 3
  }
  let date = new Date(now.toDateString()).setHours(schedule.begins)
  if (cantHoras == 0) {
    diff = (now - date)
    cantHoras = Math.floor((diff / (1000 * 60 * 60)) % 24) + 1
  }
  // console.log(`cantooras${cantHoras}`)
  // TODO-LG ACA PARA LA PRIMERA HORA DEBERIAMOS COPIAR EL MATERIAL DE LA ULTIMA HORA DLE PRIMER
  // TURNO Y GRABAARLO EN LA PRIMERA O EN LA ULTIMA
  let hours = []
  awaitFor(HourModel.find({schedule: schedule.value}).sort({ordertime: 1}).lean())
    .forEach(c => {
      if (cantHoras > 0) {
        let value = {sector: sector, schedule: schedule.value, hour: c._id, supervisor: user_id}
        hours.push(value)
        cantHoras = cantHoras - 1
      }
    })

  notification.clearNotification('must-complete')

  notification.clearNotification('something-bad')

  notification.clearNotification(sector + '-must-create-reminder')
  let materials = []
  let supervisonpart = awaitFor(SupervisionpartModel.create({
    schedule: schedule.value,
    creator: user_id,
    sector: sector,
    date: date,
    hours: hours,
    materials: materials
  }))
  supervisonpart = awaitFor(SupervisionpartModel
    .populate(supervisonpart, {path: 'hours.hour', model: 'Hour'}))
  return supervisonpart
}


function getLastOrCreate (user_id, sector) {
  return async(function () {
    let now = new Date()
    let supervisionpart = awaitFor(SupervisionpartModel.getLastSupervisionPartOfSector(sector))
    let schedule = shift.getSchedule(new Date())
    //  First supervisionpart ever
    if (supervisionpart === null) {
      winston.log('debug', 'First supervisionpart ever')
      return awaitFor(createSupervisionpart(user_id, sector, schedule, now))
    }
    let diff = (now - supervisionpart.date)
    if (diff > SHIFT_DURATION_MS) {
      winston.log('debug', 'First supervisionpart of shift:'+diff+'-'+SHIFT_DURATION_MS)
      return awaitFor(createSupervisionpart(user_id, sector, schedule, now))
    } 
    winston.log('debug', 'update hours ')
    // return supervisionpart
    return awaitFor(updateHoursSupervisionpart(supervisionpart, schedule, user_id, now))
  })()
}

/**
 * Filter with function sent as parameter and then sort by date
 * @param {Array|any[]} values to filter and sort (can be comment or value)
 * @param {Date} values[].date of the value or comment
 * @param filterCondition
 * @return {Array|any[]} return
 */
function filterAndSort (values, filterCondition) {
  let tempValues = _.filter(values, filterCondition)
  return _.sortBy(tempValues, v => v.date)
}

/* eslint-disable no-unused-vars */
/**
 * returns the total of values that evaluate true for the condition
 * @param checks of a checklist
 * @param {Function} condition The function invoked per value
 * @return {number} count of the values with the condition true
 */
function valuesWith (checks, condition) {
  const flatMap = _.flatMap(checks, c => c.values)
  return _.reduce(flatMap, (total, v) => condition(v) ? total + 1 : total, 0)
}

/**
 * This function is used in case that the array must have some specific length
 * with some specific empty objects
 * @param array to be completed with objects
 * @param obj which will be used to fill the array
 * @param val number of iterations
 * @return {Array} with the completed objects
 */
function completeObjectsMissing (array, obj, val) {
  if (array.length < val) {
    array.push(obj)
    completeObjectsMissing(array, obj, val)
  }
  return array
}

function getMaterial( materials, machine, material , sector) {
   if ( materials.length > 0) {
    var result; 
    var results;
    if ( sector == 'EXTRUSORA') {
      results = materials.sort((m1, m2) => m1.create)
      result = materials.find(function(e) {
        return e.machine == machine && e.material == material
      })
    }
    else {
      result = materials.find(function(e) {
        return e.material == material
      })
    }
    return result
   }
   return null
}

function updateMaterialsAndCalculatedTotal (req) {
  let supervisionPart = awaitFor(SupervisionpartModel
    .findById(req.body.observation.supervisionpart_id)
    .populate({path: 'hours.hour', model: 'Hour'})
    .populate('hours.comments.supervisor', ['name', 'lastname'])
    .populate('hours.values.supervisor', ['name', 'lastname'])
    // .populate('last.supervisor', ['name', 'lastname'])
    .populate('observations.supervisor', ['name', 'lastname']))
  let lastPre = supervisionPart.last
  if (supervisionPart.sector == 'EXTRUSORA') {
    let last = supervisionPart.last
    if (last != null && last.material == constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material] && constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine] == last.machine){
      let cantExtrusora = Number(req.body.observation.count)
      let material = supervisionPart.materials[supervisionPart.materials.length - 1]
      material.vagons.push({ count: cantExtrusora, number: cantExtrusora, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]}) 
      /* if (saltoHora) { 
        supervisionPart.last = {machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], 
          material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: supervisionPart.last.count,
          number: supervisionPart.last.count} 
      } 
      else { */
        supervisionPart.last = {machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], 
          material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: Number(req.body.observation.count),
          number: Number(req.body.observation.count)} 
      //} 
    }
    else {
      supervisionPart.last = {machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], 
        material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: Number(req.body.observation.count),
        number: Number(req.body.observation.count)}
      let cantExtrusora = Number(req.body.observation.count)
      supervisionPart.materials.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], 
          material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], 
          vagons: [{ count: cantExtrusora, number: cantExtrusora, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]}]})  
    }
  } 
  else { //apiladora desapiladora
    let material = getMaterial(supervisionPart.materials,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material],supervisionPart.sector)
    //console.dir(material.cantExtrusora)
    if (material == null) { 
      if (supervisionPart.sector == 'APILADORA') {
       supervisionPart.materials.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], vagons: [{ count: req.body.observation.count, number: req.body.observation.value, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]}]})
      }
      if (supervisionPart.sector == 'DESAPILADORA') {
        supervisionPart.materials.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], vagons: [{ count: req.body.observation.count, number: req.body.observation.value, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]}]})
      }  
    }
    else {
        if (supervisionPart.sector == 'APILADORA') {
          material.vagons.push({ count: req.body.observation.count, number: req.body.observation.value, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]})
        }
        if (supervisionPart.sector == 'DESAPILADORA') {
          material.vagons.push({ count: req.body.observation.count, number: req.body.observation.value, unit: constant.SUPERVISION_PART_UNIT_SECTOR[supervisionPart.sector]})
        }
    } 
  }
  
  //suma material total para la hora
  let materialTotal = getMaterial(supervisionPart.totals,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material],supervisionPart.sector)
  let pisos = constant.SUPERVISION_PART_MATERIAL_FLOORS[constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material]]
  if (materialTotal == null) {
    if (supervisionPart.sector == 'EXTRUSORA') {
        // materialTotal = getMaterial(supervisionPart.totals,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material],supervisionPart.sector)
        // if (materialTotal == null) {
          supervisionPart.totals.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: Number(req.body.observation.count), number: Number(req.body.observation.count)})
        /*}
        else {
          let cantExtrusora =  Number(req.body.observation.count) - materialTotal.count
          hour.totals.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: cantExtrusora, number: cantExtrusora})
        }*/
    }
    if (supervisionPart.sector == 'APILADORA') {
      //count /  por elnro de pisos
      let cantpisos =  Number(req.body.observation.count) / Number(pisos)
      supervisionPart.totals.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: cantpisos, number: 1})
    }
    if (supervisionPart.sector == 'DESAPILADORA') {
      supervisionPart.totals.push({machine: constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine], material: constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material], count: 1, number: 1})
    }  
  }
  else {
    if (supervisionPart.sector == 'EXTRUSORA') {
      if (lastPre != null){
        if (lastPre.material == constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material] && constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine] == lastPre.machine){
          materialTotal.count = (materialTotal.count - lastPre.count) +  Number(req.body.observation.count)
          materialTotal.number = (materialTotal.count - lastPre.count) +  Number(req.body.observation.count)
        }
        else {
          materialTotal.count = materialTotal.count  +  Number(req.body.observation.count)
          materialTotal.number = materialTotal.count  +  Number(req.body.observation.count)
        }
      }  
      else {
        let totalPart = getMaterial(supervisionPart.totals,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material],supervisionPart.sector)
        if (totalPart != null ){
          let totalparte =  totalPart.count - materialTotal.count
          materialTotal.count = Number(req.body.observation.count) - totalparte
          materialTotal.number = Number(req.body.observation.count) - totalparte
        }
        else {
          materialTotal.count = Number(req.body.observation.count) 
          materialTotal.number = Number(req.body.observation.count) 
        }
      } 
    }
    else {
      if (supervisionPart.sector == 'DESAPILADORA') {
        // para la apiladora o para la desapiladora se suman el nro.
        materialTotal.count = materialTotal.count + 1
      } 
      else {
        //apiladora : count /  por elnro de pisos
        let cantpisos =  Number(req.body.observation.count) / Number(pisos)
        materialTotal.count += eval(cantpisos)
      }
      let material = getMaterial(supervisionPart.materials,constant.SUPERVISION_PART_MACHINE_READBLE[req.body.observation.machine],constant.SUPERVISION_PART_MATERIAL_READBLE[req.body.observation.material],supervisionPart.sector)
      materialTotal.number = material.vagons.length 
    }
  }
  return supervisionPart
}

function completeTotalesMaterialExtrusora(supervisonpart,totalesMaterial) {
  if (supervisonpart.totals.length > 0 ) {
    supervisonpart.totals.forEach( ht => {
      let tonXPallet = constant.SUPERVISION_PART_MATERIAL_TONELADAS[ht.material]
      let ladrillosXCarro = constant.SUPERVISION_PART_LADRILLO_CARRO[ht.material]
      let pesoLadrillo = constant.SUPERVISION_PART_PESO_LADRILLO[ht.material]
      let indice = constant.SUPERVISION_PART_MATERIALS[ht.material]
      if (supervisonpart.schedule=='NOCHE'){
        indice=indice+10;
      }     
      if (supervisonpart.schedule=='TARDE'){
        indice=indice+20;
      }    
      if (supervisonpart.schedule=='MANIANA'){
        indice=indice+30;
      }
      if(totalesMaterial[indice]) {
        totalesMaterial[indice] = {
          sector: 'EXTRUSORA',
          indice: constant.SUPERVISION_PART_MATERIALS[ht.material]+''+supervisonpart.schedule,
          fecha: supervisonpart.date, 
          turno: shift.getShiftForSchedule( supervisonpart.schedule, supervisonpart.date),
          schedule: supervisonpart.schedule,
          material: ht.material,
          unidades: totalesMaterial[indice].unidades + ht.count,
          //toneladas: tonXPallet * (totalesMaterial[indice].unidades + ht.count),
          toneladas: totalesMaterial[indice].toneladas + (ladrillosXCarro * ht.count * pesoLadrillo),
          machine: ht.machine,
          pesoLadrillo: pesoLadrillo,
          tiempoMarcha: supervisonpart.totalMinutesWithoutStopping,
          palletReposicion: supervisonpart.totalRepositionPallet
        }
      }
      else {
        totalesMaterial[indice] = { 
          sector: 'EXTRUSORA',
          fecha: supervisonpart.date,
          turno: shift.getShiftForSchedule( supervisonpart.schedule, supervisonpart.date),
          schedule: supervisonpart.schedule,
          material: ht.material, 
          unidades: ht.count,
          //toneladas: tonXPallet * ht.count,
          toneladas: ladrillosXCarro * ht.count * pesoLadrillo,
          machine: ht.machine,
          pesoLadrillo: pesoLadrillo,
          tiempoMarcha: supervisonpart.totalMinutesWithoutStopping,
          palletReposicion: supervisonpart.totalRepositionPallet
        }
      }
    })
  }
  return totalesMaterial
}

function completeTotalesMaterialApiladora(supervisonpart,totalesMaterial) {
  if (supervisonpart.totals.length > 0 ) {
    supervisonpart.totals.forEach( ht => {
    let tonXPallet = constant.SUPERVISION_PART_MATERIAL_TONELADAS[ht.material]
    let pesoLadrillo = constant.SUPERVISION_PART_PESO_LADRILLO[ht.material]
    let ladrillosXVagon = constant.SUPERVISION_PART_LADRILLO_VAGON[ht.material]
    let indice = constant.SUPERVISION_PART_MATERIALS[ht.material]
    if (supervisonpart.schedule=='NOCHE'){
      indice=indice+10;
    }     
    if (supervisonpart.schedule=='TARDE'){
      indice=indice+20;
    }    
    if (supervisonpart.schedule=='MANIANA'){
      indice=indice+30;
    }
    if(totalesMaterial[indice]) {
      totalesMaterial[indice] = {  
        sector: 'APILADORA',
        fecha: supervisonpart.date, 
        turno: shift.getShiftForSchedule( supervisonpart.schedule, supervisonpart.date),
        schedule: supervisonpart.schedule,
        material: ht.material,
        unidades: totalesMaterial[indice].unidades + ht.count,
        toneladas: totalesMaterial[indice].toneladas + (ladrillosXVagon * pesoLadrillo * ht.count),
        pesoLadrillo: pesoLadrillo,
        tiempoMarcha: supervisonpart.totalMinutesWithoutStopping,
        palletReposicion: supervisonpart.totalRepositionPallet
      }
    }
    else {
      totalesMaterial[indice] = { 
        sector: 'APILADORA',
        fecha: supervisonpart.date,
        turno: shift.getShiftForSchedule( supervisonpart.schedule, supervisonpart.date),
        schedule: supervisonpart.schedule,
        material: ht.material, 
        unidades: ht.count,
        toneladas: ladrillosXVagon * pesoLadrillo * ht.count,
        pesoLadrillo: pesoLadrillo,
        tiempoMarcha: supervisonpart.totalMinutesWithoutStopping,
        palletReposicion: supervisonpart.totalRepositionPallet
      }
    }
   })
  }
  return totalesMaterial
}

function getTotalDesapiladora(supervisionPart, material){
  if (material == '8')
    return supervisionPart.total_MOLDE_8;
  if (material == '12-6A')
   return supervisionPart.total_MOLDE_12_6A;
  if (material == '12-9A')
   return supervisionPart.total_MOLDE_12_8A;
  if (material == '18')
   return supervisionPart.total_MOLDE_18;
  if (material == 'P12')
    return supervisionPart.total_MOLDE_P12;
  if (material == 'P18')
    return supervisionPart.total_MOLDE_P18;
  if (material == 'L11')
    return supervisionPart.total_MOLDE_L11;
  if (material == 'C')
    return supervisionPart.total_MOLDE_C;
  if (material == 'DM20')
   return supervisionPart.total_MOLDE_DM20;
  if (material == 'DM24')
   return supervisionPart.total_MOLDE_DM24;
  if (material == 'DM4')
     return supervisionPart.total_MOLDE_DM4;
  if (material == 'DIN18')
     return supervisionPart.total_MOLDE_DIN18;
  if (material == 'DIN27')
    return supervisionPart.total_MOLDE_DIN27;
  if (material == 'COLUMNA')
    return supervisionPart.total_MOLDE_COLUMNA;
 return 1;
}

function completeTotalesMaterialDesapiladora(supervisonpart,totalesMaterial) {
  if (supervisonpart.totals.length > 0 ) {
    supervisonpart.totals.forEach( ht => {
      //let tonXPallet = constant.SUPERVISION_PART_MATERIAL_TONELADAS[ht.material]
      let pesoLadrillo = constant.SUPERVISION_PART_PESO_LADRILLO[ht.material]
      let ladrillosXPallet = constant.SUPERVISION_PART_LADRILLO_PALLET[ht.material]
      let indice = constant.SUPERVISION_PART_MATERIALS[ht.material]
      if (supervisonpart.schedule=='NOCHE'){
        indice=indice+10;
      }     
      if (supervisonpart.schedule=='TARDE'){
        indice=indice+20;
      }    
      if (supervisonpart.schedule=='MANIANA'){
        indice=indice+30;
      }
      let materialTotal = getTotalDesapiladora(supervisonpart,ht.material);
      if(totalesMaterial[indice]) {
        totalesMaterial[indice] = { 
          sector: 'DESAPILADORA',
          fecha: supervisonpart.date,
          turno: shift.getShiftForSchedule( supervisonpart.schedule, supervisonpart.date),
          schedule: supervisonpart.schedule,
          material: ht.material,
          unidades: totalesMaterial[indice].unidades + materialTotal,
          toneladas: totalesMaterial[indice].unidades + (ladrillosXPallet * materialTotal * pesoLadrillo),
          pesoLadrillo: pesoLadrillo,
          tiempoMarcha: supervisonpart.totalMinutesWithoutStopping
        }
      }
      else {
        totalesMaterial[indice] = { 
          sector: 'DESAPILADORA',
          fecha: supervisonpart.date,
          turno: shift.getShiftForSchedule( supervisonpart.schedule, supervisonpart.date),
          schedule: supervisonpart.schedule,
          material: ht.material, 
          unidades: materialTotal,
          toneladas: ladrillosXPallet * materialTotal * pesoLadrillo,
          pesoLadrillo: pesoLadrillo,
          tiempoMarcha: supervisonpart.totalMinutesWithoutStopping
        }
      }
    })
  }
  return totalesMaterial
}

function completeTotalesMaterial(supervisonpart,totalesMaterial) {
  supervisonpart.totals.forEach( ht => {
    let tonXPallet = constant.SUPERVISION_PART_MATERIAL_TONELADAS[ht.material]
    let indice = constant.SUPERVISION_PART_MATERIALS[ht.material]
    if(totalesMaterial[indice]) {
      totalesMaterial[indice] = { 
        fecha: supervisonpart.date, 
        material: ht.material,
        unidades: totalesMaterial[indice].unidades + ht.count,
        toneladas: tonXPallet * (totalesMaterial[indice].unidades + ht.count)
      }
    }
    else {
      totalesMaterial[indice] = { 
        fecha: supervisonpart.date,  
        material: ht.material,        
        unidades: ht.count,
        toneladas: tonXPallet * ht.count
      }
    }
  })
  return totalesMaterial
}
/**
 * This function is used in case that the array must have some specific length
 * with some specific empty objects
 * @param array to be completed with objects
 * @param obj which will be used to fill the array
 * @param val number of iterations
 * @return {Array} with the completed objects
 */
function completeCalculatedTotalData (supervisionpart) {
  let totalStoppings = 0
  let totalUnits = 0
  let totalDurity = 0
  let totalPalletCamara = 0
  let totalPalletContador = 0
  let totalVacuum = 0
  let countHoursVacuum = 0
  let countHoursDurity = 0
  let countVagons = 0
  let totalGenerals = []
  
  supervisionpart.materials.forEach( m => {
    countVagons = countVagons + m.vagons.length
  })
  supervisionpart.hours.forEach( h => {
    h.stoppings.forEach( s => {
      totalStoppings = totalStoppings + s.minutes
    })
    totalPalletCamara = totalPalletCamara + h.palletsCamara
    totalPalletContador = totalPalletContador + h.palletsContador
    if (h.durity > 0) {
      countHoursDurity = countHoursDurity + 1
      totalDurity = totalDurity + h.durity
    }
    if (h.vacuum > 0) {
      totalVacuum = totalVacuum + h.vacuum  
      countHoursVacuum = countHoursVacuum + 1
    } 
    
  })

  supervisionpart.totals.forEach( ht => {
      totalUnits = totalUnits + ht.count
  })
  
  //24-05-21 lgoicoechea comento esto pq creo q es viejo
  //supervisionpart.totalPalletsCamara = totalPalletCamara
  //supervisionpart.totalPalletsContador = totalPalletContador
  supervisionpart.totalDurity = totalDurity
  if (totalDurity > 0 ) {
    var n = totalDurity / countHoursDurity
    if (n > 0){
      supervisionpart.totalDurity = Math.round(n*100)/100 
    }
  }
    

  supervisionpart.totalVacuum = totalVacuum
  if (totalVacuum > 0)  {
    var n = totalVacuum / countHoursVacuum
    if (n > 0){
     supervisionpart.totalVacuum = Math.round(n*100)/100 
    }
  }
  supervisionpart.countVagon = countVagons
  supervisionpart.totalUnits = totalUnits
  supervisionpart.totalStoppings = totalStoppings
  return supervisionpart
}



function summaryForSector (date, sector) {
  let supervisionparts = awaitFor(SupervisionpartModel.getSupervisionPartForDayAndSector(date, sector))
  supervisionparts = _.orderBy(supervisionparts, c => c.date)
  //const revision = getSummaryWith(checklists, getRevisionForChecklist)
  //const correction = getSummaryWith(checklists, getCorrectionForChecklist)
  //return {revision, correction, sector: sector}
  return { supervisonparts}
}

/*function getSummaryWith (checklists, functionSummary) {
  let singleSummary = []
  checklists.forEach(checklist => {
    let checklistData = functionSummary(checklist)
    checklistData.shift = shift.getShift(checklist.date)
    checklistData.schedule = shift.getSchedule(checklist.date).readable
    singleSummary.push(checklistData)
  })
  completeObjectsMissing(singleSummary, null, SECTORS.length)
  return singleSummary
}*/

module.exports = controller
