const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const path = require('path')
// Cant use require(path.join(__dirname, '../model')).user because of how dependency resolves
const UserModel = require(path.join(__dirname, '../model/user'))
const flatMapDeep = require('lodash/flatMapDeep')
const uniqWith = require('lodash/uniqWith')
const flattenDeep = require('lodash/flattenDeep')

const service = {
  teamOf: async(function (userId) {
    const user = awaitFor(UserModel.findById(userId, {responsibleOf: 1}))
    if (user.responsibleOf.length === 0) {
      return []
    } else {
      return flatMapDeep(user.responsibleOf, u => awaitFor(this.teamOf(u)))
        .concat(user.responsibleOf)
    }
  }),
  directBossesOf: async(function (userId) {
    return UserModel.find({responsibleOf: userId}, {_id: 1})
  }),
  allBossesOf: async(function (users) {
    if (users.some(u => u._id)) {
      users = users.map(u => u._id)
    }
    let everyBoss = users.map(u => this.bossesChainOf(u))
    everyBoss = awaitFor(Promise.all(everyBoss))
    everyBoss = flattenDeep(everyBoss)
    everyBoss = uniqWith(everyBoss, (boss, otherBoss) => boss.equals(otherBoss))
    return everyBoss
  }),
  bossesChainOf: async(function (userId) {
    const directBosses = awaitFor(this.directBossesOf(userId))
      .map(b => b._id)
    if (directBosses.length === 0) {
      return []
    } else {
      return flatMapDeep(directBosses, b => awaitFor(this.bossesChainOf(b)))
        .concat(directBosses)
    }
  }),
  indirectTeamOf: async(function (userId) {
    const directTeam = awaitFor(UserModel.findById(userId, {responsibleOf: 1})).responsibleOf
    return awaitFor(this.teamOf(userId))
      .filter(u => !directTeam.some(t => t.equals(u)))
  })
}

module.exports = service
