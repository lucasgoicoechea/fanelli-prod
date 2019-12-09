const path = require('path')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
// Cant use require(path.join(__dirname, '../service')).team because of how dependency resolves

const TeamService = require(path.join(__dirname, '../service/team'))

module.exports = {
  //  must be called this way awaitFor(cursor.teamOf(options.teamOf)).query to obtain query cursor
  queryTeam: function (whereIsTeam, creator = 'creator') {
    return async(function (userId) {
      const team = awaitFor(TeamService.teamOf(userId))
      const teamQuery = {}
      // building query - searching documents that the team is included
      // ex collaborators in [ id1, id2, .. ]
      teamQuery[whereIsTeam] = {
        $in: team
      }
      const creatorQuery = {}
      // building query - searching documents that the creator is the user
      // ex creator =  id1
      creatorQuery[creator] = userId

      // Getting old query to inject new query with team
      // cannot use .or in case that the query already has an or because it'll be add to the or property
      const oldQuery = this.getQuery()
      const query = {
        $and: [{$or: [teamQuery, creatorQuery]}, oldQuery]
      }
      return {query: this.find(query)}
    })
  },

  queryBosses: function (whereIsTeam) {
    return async(function (userId) {
      const team = awaitFor(TeamService.bossesChainOf(userId))
      return this.where(whereIsTeam).in(team)
    })
  }
}
