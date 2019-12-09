const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
const UserModel = require(path.join(__dirname, '../model')).user
const teamService = require(path.join(__dirname, '/team'))

const service = {
  getIntersectionResponsible: async(function (userId, responsible) {
    responsible = responsible.map(r => r.toString())
    const bosses = awaitFor(teamService.bossesChainOf(userId)).map(b => b.toString())
    const intersection = responsible.filter(r => bosses.includes(r))
    return awaitFor(UserModel.findManyIds(intersection))
  }),
  canBeResponsibleOf: async(function (userId, responsible) {
    responsible = responsible.map(r => r.toString())
    if (responsible.includes(userId)) {
      return false
    }
    const bosses = awaitFor(teamService.bossesChainOf(userId)).map(b => b.toString())
    return !bosses.some(b => responsible.includes(b))
  }),
  isThereAnyWith: async(function (condition) {
    return awaitFor(UserModel.find(condition)).length > 0
  }),
  bossesOf: async(function (id) {
    const bosses = awaitFor(teamService.directBossesOf(id))
    return UserModel.find({_id: {$in: bosses}})
  }),
  indirectTeamOf: async(function (id) {
    const team = awaitFor(teamService.indirectTeamOf(id))
    return UserModel.find({_id: {$in: team}})
  }),
  teamOf: async(function (id) {
    const team = awaitFor(teamService.teamOf(id))
    return UserModel.find({$or: [{_id: {$in: team}}, {_id: id}], deactivated: {$ne: true}})
      .select({
        name: 1,
        lastname: 1,
        deactivated: 1,
        legajo: 1,
        s3Key: 1,
        user_type: 1,
        shift: 1,
        sector: 1,
        area: 1,
        'auth.username': 1
      })
      .populate('shift', 'value')
  }),
  all: async(function () {
    return UserModel.find({deactivated: {$ne: true}})
      .select({
        name: 1,
        lastname: 1,
        deactivated: 1,
        legajo: 1,
        s3Key: 1,
        user_type: 1,
        shift: 1,
        sector: 1,
        area: 1,
        'auth.username': 1
      })
      .populate('shift', 'value')
  }),
  allWithDeactivated: async(function () {
    return UserModel.find({})
      .select({
        name: 1,
        lastname: 1,
        legajo: 1,
        s3Key: 1,
        deactivated: 1,
        user_type: 1,
        shift: 1,
        sector: 1,
        area: 1,
        'auth.username': 1
      })
      .populate('shift', 'value')
  }),
}

module.exports = service
