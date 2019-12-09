const chai = require('chai')
const expect = chai.expect
const path = require('path')
const teamService = require(path.join(__dirname, '/../service')).team
const UserModel = require(path.join(__dirname, '/../model')).user
const userService = require(path.join(__dirname, '/../service')).user
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
const sinon = require('sinon')
const ObjectId = require('mongoose').Types.ObjectId
const factory = require(path.join(__dirname, '/helper/factory'))
const {queryTeam, queryBosses} = require(path.join(__dirname, '/../libs/queryResponsible'))
const dateFns = require('date-fns')
const Const = require(path.join(__dirname, '/../libs/const'))

describe('Team', () => {
  afterEach((done) => {
    // Users created here must have team in their address to be deleted otherwise it messes
    // with next legacy tests (not legacy but written when i was even more noob)
    UserModel
      .remove({address: 'team'})
      .then(() => done())
      .catch(done)
  })
  it('should return users team', async(function () {
    const leafUser1 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const leafUser2 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const nodeUser1 = awaitFor(UserModel.create(factory.user({
      responsibleOf: [leafUser1._id, leafUser2._id],
      address: 'team'
    })))
    const leafUser3 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const rootUser = awaitFor(UserModel.create(factory.user({responsibleOf: [nodeUser1, leafUser3], address: 'team'})))
    let team = awaitFor(teamService.teamOf(leafUser1._id))
    expect(team).to.be.empty
    team = awaitFor(teamService.teamOf(nodeUser1._id))
    expect(team).to.have.lengthOf(2)
    team = awaitFor(teamService.teamOf(rootUser._id))
    expect(team).to.have.lengthOf(4)
    const expected = [leafUser1, leafUser2, nodeUser1, leafUser3]
      .map(u => u._id.toString())
    expect(team.map(a => a.toString())).eql(expected)
  }))
  it('should return users direct bosses', async(function () {
    const leafUser1 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const bossUser1 = awaitFor(UserModel.create(factory.user({responsibleOf: [leafUser1], address: 'team'})))
    const bossUser2 = awaitFor(UserModel.create(factory.user({responsibleOf: [leafUser1], address: 'team'})))
    let bosses = awaitFor(teamService.directBossesOf(leafUser1._id))
    expect(bosses).to.have.lengthOf(2)
    bosses = awaitFor(teamService.directBossesOf(bossUser1._id))
    expect(bosses).to.be.empty
  }))
  it('should return users bosses chain', async(function () {
    const leafUser1 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const nodeUser1 = awaitFor(UserModel.create(factory.user({responsibleOf: [leafUser1._id], address: 'team'})))
    const rootUser = awaitFor(UserModel.create(factory.user({responsibleOf: [nodeUser1._id], address: 'team'})))
    let bosses = awaitFor(teamService.bossesChainOf(leafUser1._id))
    expect(bosses).to.have.lengthOf(2)
    const expected = [rootUser, nodeUser1]
      .map(u => u._id.toString())
    expect(bosses.map(b => b.toString())).eql(expected)
    bosses = awaitFor(teamService.bossesChainOf(nodeUser1._id))
    expect(bosses).to.have.lengthOf(1)
    bosses = awaitFor(teamService.bossesChainOf(rootUser._id))
    expect(bosses).to.be.empty
  }))
  it('should make a team query ', async(function () {
    const leafUser1 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const leafUser2 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const nodeUser1 = awaitFor(UserModel.create(factory.user({
      responsibleOf: [leafUser1._id, leafUser2._id],
      address: 'team'
    })))
    const leafUser3 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const rootUser = awaitFor(UserModel.create(factory.user({responsibleOf: [nodeUser1, leafUser3], address: 'team'})))
    const queryCollaborators = queryTeam('collaborators')
    const mockSchema = {
      queryCollaborators: queryCollaborators,
      getQuery: sinon.fake.returns({
        $or: [
          {
            _id: 1
          },
          {
            _id: 1
          }
        ]
      }),
      find: sinon.stub().returnsThis()
    }
    const expected = {
      $and: [
        {
          $or: [
            {
              collaborators: {
                $in: [leafUser1, leafUser2, nodeUser1, leafUser3].map(u => u._id)
              }
            },
            {
              creator: rootUser._id
            }
          ]
        },
        // Old Query
        {
          $or: [
            {
              _id: 1
            },
            {
              _id: 1
            }
          ]
        }
      ]
    }
    awaitFor(mockSchema.queryCollaborators(rootUser._id))
    expect(mockSchema.find.getCall(0).args[0]).eqls(expected)
  }))
  it('should return an user indirect team', async(function () {
    const leafUser1 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const leafUser2 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const nodeUser1 = awaitFor(UserModel.create(factory.user({
      responsibleOf: [leafUser1._id, leafUser2._id],
      address: 'team'
    })))
    const leafUser3 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const rootUser = awaitFor(UserModel.create(factory.user({responsibleOf: [nodeUser1, leafUser3], address: 'team'})))
    const indirectTeam = awaitFor(teamService.indirectTeamOf(rootUser._id))
    const expected = [leafUser1, leafUser2].map(u => u._id)
    expect(indirectTeam).to.be.eql(expected)
  }))

  it('should return bosses of multiple users', async(function () {
    const leafUser1 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const leafUser2 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const nodeUser1 = awaitFor(UserModel.create(factory.user({
      responsibleOf: [leafUser1._id, leafUser2._id],
      address: 'team'
    })))
    const leafUser3 = awaitFor(UserModel.create(factory.user({address: 'team'})))
    const nodeUser2 = awaitFor(UserModel.create(factory.user({
      responsibleOf: [leafUser3._id],
      address: 'team'
    })))
    const rootUser = awaitFor(UserModel.create(factory.user({responsibleOf: [nodeUser2._id, nodeUser1._id], address: 'team'})))
    const bosses = awaitFor(teamService.allBossesOf([leafUser1._id, leafUser2._id, leafUser3._id]))
    const expected = [rootUser, nodeUser1, nodeUser2].map(u => u._id)
    expect(bosses).to.be.eql(expected)
  }))
})
