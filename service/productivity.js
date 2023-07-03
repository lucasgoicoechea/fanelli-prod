const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const ProductivityModel = require(path.join(__dirname, '../model')).productivity
const notification = require(path.join(__dirname, '/../libs/notification'))
const pdf = require(path.join(__dirname, '/../libs/pdf'))
const moment = require('moment')
const dateFns = require('date-fns')
const teamService = require(path.join(__dirname, '/team'))
const Const = require(path.join(__dirname, '../libs/const'))
const NOTIFICATION_TYPE = Const.NOTIFICATION_TYPE
const service = {

  create: async(function (productivity) {
    let productivityTmp = productivity;
    if (productivity.type === 'FRECUENCY') {
     /* if (productivity.frecuency !== 'WEEKLY') {
         productivityTmp = awaitFor(ProductivityModel.create(productivity))
      }*/
      createRepetitionsProductivity(productivityTmp)
    }
    else productivityTmp = awaitFor(ProductivityModel.create(productivity))
    return productivityTmp
  }),
  getPdf: async(function (productivityId) {
    const productivity = awaitFor(ProductivityModel
      .findById(productivityId)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, dni: 1, sector: 1, position: 1}
      })
      .populate('creator', 'name lastname legajo'))
    return pdf.createPdf(pdf.getProductivityContent(productivity))
  }),
  getById: async(function (productivityId) {
    return awaitFor(ProductivityModel.findById(productivityId)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1, s3Key: 1}
      })
      .populate('creator', 'name lastname legajo s3Key'))
  }),
  getByIdOrigin: async(function (productivityId) {
    let productivitys = ProductivityModel
      .find({
        _originId: productivityId
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
      return productivitys
  }),
  list: async(function (options) {
    let productivitys = ProductivityModel.find({
      date:{$gte:new Date(new Date().getTime()-(2*24*60*60*1000))}
    })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    productivitys = filter(productivitys, options)
    return paginateAndSort(productivitys, options)
  }),
  getActiveByUser: async(function (userId, options, filters = {}) {
    let productivitys = ProductivityModel
      .find({
        $or: [{creator: userId}, {collaborators: userId}]
      })
      .sort({created_at: -1})
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(productivitys, options)
  }),
  listMyProductivitysMonth: async(function (id, month, year, options) {
    var start = new Date(new Date(year+"-"+month+"-01").getTime()-(24*60*60*1000))
    var end = new Date(new Date(year+"-"+month+"-30").getTime()+(24*60*60*1000))
    var conditions = id==null?{date:{$gte: start, $lt: end}}:{
      date:{$gte: start, $lt: end},
      $or: [{creator: id}, {collaborators: id}]
    }

    console.dir(conditions)
    let productivitys = ProductivityModel
      .find(conditions)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(productivitys, options)
  }),
  listMyProductivitys: async(function (id, options) {
    let productivitys = ProductivityModel
      .find({
        date:{$gte:new Date(new Date().getTime()-(2*24*60*60*1000))},
        $or: [{creator: id}, {collaborators: id}]
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
    return paginateAndSort(productivitys, options)
  }),
  listMyProductivitysAll: async(function (id, options) {
    let productivitys = ProductivityModel
      .find({
        // date:{$lte:new Date(new Date().getTime()+(24*60*60*1000))},
        $or: [{creator: id}, {collaborators: id}]
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
      return paginateAndSort(productivitys, options)
    }),
    listMyProductivitysAllPass : async(function (id, options) {
      let productivitys = ProductivityModel
      .find({
        date:{$lte:new Date(new Date().getTime()+(24*60*60*1000))},
        $or: [{creator: id}, {collaborators: id}]
      })
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
      productivitys = filterProductivity(productivitys,options)
    return paginateAndSort(productivitys, options,-1)
  }),
  listAllPass : async(function (options) {
    let productivitys = ProductivityModel
    .find({
      date:{$lte:new Date(new Date().getTime()+(24*60*60*1000))}
    })
    .populate({
      path: 'collaborators',
      populate: {path: 'shift', select: 'value'},
      select: {name: 1, lastname: 1, legajo: 1}
    })
    .populate('creator', 'name lastname legajo')
    productivitys = filterProductivity(productivitys,options)
  return paginateAndSort(productivitys, options,-1)
  }),
  edit: async(function (id, productivity,repeatEdit) {
    awaitFor(ProductivityModel.update({_id: id}, {$set: productivity}))
    if (repeatEdit) {
      let idorigin = productivity._originId || id
      awaitFor(ProductivityModel.updateMany({_originId: idorigin}, {$set:{"time": productivity.time}}))
    }
    return ProductivityModel.findById(id)
      .populate({
        path: 'collaborators',
        populate: {path: 'shift', select: 'value'},
        select: {name: 1, lastname: 1, legajo: 1}
      })
      .populate('creator', 'name lastname legajo')
  }),
  remove: async(function (id) {
    const productivity = awaitFor(ProductivityModel.findById({_id: id}))
    awaitFor(productivity.remove())
    return true
  }),
  removeAll: async(function (id) {
    const productivity = awaitFor(ProductivityModel.findById({_id: id}))
    const productivitys = awaitFor(ProductivityModel.find({_originId: productivity._originId }))
    productivitys.forEach(dweek => { awaitFor(dweek.remove()) })
    return true
  }),
  isCreator: async(function (userId, productivityId) {
    const productivity = awaitFor(ProductivityModel.findById(productivityId))
    return productivity.creator.equals(userId)
  })
}

function filterProductivity (productivityss, filters) {
  /*if (filters.collaborator) {
    eppCursor = eppCursor.where('collaborator').equals(filters.collaborator)
  }*/
  // console.dir(filters)
  if (filters.date) {
    filters.date = new Date (filters.date)
    productivityss = productivityss.where('date').gt(filters.date).lt(dateFns.addDays(filters.date, 1))
  }
  if (filters.type) {
    productivityss = productivityss.where('type').equals(filters.type)
  }
  if (filters.frecuency) {
    productivityss = productivityss.where('frecuency').equals(filters.frecuency)
  }
  if (filters.state) {
    productivityss = productivityss.where('state').equals(filters.state)
  }
  /*if (filters.teamOf) {
    eppCursor = awaitFor(eppCursor.teamOf(filters.teamOf)).query
  }*/
  return productivityss
}

const paginateAndSort = function (cursor, options = {},asc=1) {
  cursor = cursor
      .sort({date: asc})
   // .sort({created_at: -1})
  if (options.page !== undefined) {
    options.perPage = options.perPage || 15
    cursor = cursor
      .skip(options.perPage * (options.page - 1))
      .limit(options.perPage)
  }
  return cursor
}

const createRepetitionsProductivity = function (productivity) {
  if (productivity.frecuency === 'DAILY') {
     //desde hasta crear reuniones con el MEETING_origin
     var firts = true;
     var a = moment(productivity.date);
     var b = moment(productivity.dateFrom);
     var tmp;
     for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
        //console.log(m.format('YYYY-MM-DD'));
        if (firts){
            productivityT = awaitFor(ProductivityModel.create(productivity));
            firts = false;
        }
        tmp = m.clone();    
        cloneWithAnotherDate(productivityT,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
      } 
      awaitFor(productivityT.remove());
  } 

  if (productivity.frecuency === 'WEEKLY') {
    var a = moment(productivity.date);
    var b = moment(productivity.dateFrom);
    var firts = true;
    let productivityT = productivity;
    var tmp;
    //desde hasta crear reuniones con el MEETING_origin
    productivity.weeklys.forEach(dweek => {
      // Get "next" monday
        let dday = Const.WEEKLY_MEETING_FRECUENCY_DAY[dweek];
        let m = a.clone().day(dday);
        if( m.isAfter(a, 'd') ){ 
          console.log(m.format('YYYY-MM-DD'));
        }
        while( m.isBefore(b) ){ 
          //console.log(m.format('YYYY-MM-DD'));
          if (firts){
            productivityT = awaitFor(ProductivityModel.create(productivity));
          }
          tmp = m.clone();
          if (!firts){
            cloneWithAnotherDate(productivityT,new Date(tmp.locale("en").add(1, 'd').format("YYYY-MM-DD")));
          }
          else {
            firts = false;
          }
          m.add(7, 'days'); 
        }
        });
   }

  if (productivity.frecuency === 'MONTHLY') {
    productivityT = awaitFor(ProductivityModel.create(productivity));
    sendCreateNotification(productivityT)
    productivity.dates.forEach(element => {
      if (element !== null && element !== "") {
        var a = moment(productivity.date);
        let productivityT = productivity;
        cloneWithAnotherDate(productivityT,element);
      }
    });  
  }
  return productivity
}


const sendCreateNotification = async(function (productivity) {
  productivityg = awaitFor(ProductivityModel.findById(productivity._id)
  .populate('creator', 'name lastname')
  .populate('collaborators', 'name lastname'))
  let everyBoss = awaitFor(teamService.allBossesOf(productivity.collaborators))
  
  notification.sendNotification(
    {_id: {$in: everyBoss}},
    new notification.Payload('Nueva Reunión', '/productivity', NOTIFICATION_TYPE.productivity,
      {
        collaborators: productivityg.collaborators.map(c => c.basicInfo()),
        creator: productivityg.creator.basicInfo(),
        state: productivityg.state
      })
  )
})

const cloneWithAnotherDate = function (productivity, dateOther) {
    let productivityRepeat = {
      collaborators: productivity.collaborators,
      editors: productivity.editors,
      creator: productivity.creator,
      type: productivity.type,
      frecuency: productivity.frecuency,
      date: dateOther,
      dateFrom: productivity.dateFrom,
      recommendations: productivity.recommendations,
      weeklys: productivity.weeklys,
      names: productivity.names,
      description: productivity.description,
      time: productivity.time,
      _originId: productivity._id
    }
    return awaitFor(ProductivityModel.create(productivityRepeat))
}

const filter = function (cursor, options = {}) {
  if (options.teamOf) {
    console.log('list')
    cursor = awaitFor(cursor.teamOf(options.teamOf)).query
  }
  return cursor
}
module.exports = service
