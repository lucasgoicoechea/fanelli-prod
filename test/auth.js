// Require the dev-dependencies
const path = require('path')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require(path.join(__dirname, '/../index'))
let userModel = require(path.join(__dirname, '/../model/user'))
let users = require(path.join(__dirname, '/data/users'))
let shiftData = require(path.join(__dirname, '/data/shift'))
let shiftModel = require(path.join(__dirname, '/../model/shift'))
/* eslint-disable */
let should = chai.should()
/* eslint-enable */

chai.use(chaiHttp)
describe('Auth', () => {
  before((done) => {
    // create a mongoose acceptable array to save
    let userData = []
    Object.keys(users).forEach((key) => userData.push(users[key]))
    // Before the test we empty the user collection
    userModel.remove({})
      .then(() => shiftModel.remove({}))
    // And fill it with data
      .then(() => shiftModel.create(shiftData))
      .then(() => userModel.create(userData))
      .then(() => done())
      .catch(error => done(error))
  })

  describe('POST Login', () => {
    it('it should login', (done) => {
      chai.request(server)
        .post('/api/login')
        .send(users.superadmin.auth)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('user')
          done()
        })
    })
  })
})
describe('Subscriptions', () => {
  describe('POST Subscribe', () => {
    it('it should subscribe', (done) => {
      chai.request(server)
        .post('/api/subscribe')
        .send({subscription: {endpoint: '1234'}})
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('subscription_id')
          userModel.findOne({_id: users.supervisor._id})
            .then(user => {
              user.should.have.property('devices').not.be.empty
              done()
            })
        })
    })
  })
})
