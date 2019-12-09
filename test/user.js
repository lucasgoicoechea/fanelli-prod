'use strict'
// Require the dev-dependencies
const path = require('path')
const fs = require('fs')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require(path.join(__dirname, '/../index'))
let users = require(path.join(__dirname, '/data/users'))
let userModel = require(path.join(__dirname, '/../model')).user
const factory = require(path.join(__dirname, '/helper/factory'))
const userService = require(path.join(__dirname, '/../service')).user

/* eslint-disable */
let should = chai.should()
/* eslint-enable */
let user
let notificationSeenID
const expect = chai.expect
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')

chai.use(chaiHttp)
describe('user', () => {
  describe('get supervisor notifications', () => {
    it('it should get the notifications of the user', done => {
      chai.request(server)
        .get('/api/user/me/notifications')
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('notifications').to.be.not.empty
          done()
        })
    })
  })
  describe('get pañol notifications', () => {
    it('it should get the notifications of the user', done => {
      chai.request(server)
        .get('/api/user/me/notifications')
        .set('authorization', 'Bearer ' + users.paniolero.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('notifications').to.be.not.empty
          done()
        })
    })
  })
  describe('POST register', () => {
    it('should register a new employee', (done) => {
      user = {
        legajo: '123',
        dni: '123',
        name: 'foo',
        lastname: 'bar',
        cuil: 'aara'
      }
      chai.request(server)
        .post('/api/user')
        .send(user)
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('user')
          res.body.user.should.have.property('dni').eql(user.dni)
          user = res.body.user
          done()
        })
    })
  })
  describe('PUT user', () => {
    it('should edit a employee', (done) => {
      let userEdited = {
        name: 'te',
        email: 'foo@bar.com',
        landlinePhone: '1234'
      }
      chai.request(server)
        .put('/api/user/' + user._id)
        .send({user: userEdited})
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('user')
          // res.body.user.should.have.property('name').eql(userEdited.name)
          res.body.user.should.have.property('dni').eql(user.dni)
          done()
        })
    })
  })
  describe('POST image to user', () => {
    it('should save an image to the user', function (done) {
      chai.request(server)
        .post('/api/user/picture/' + users.colaborador._id)
        .attach('picture', fs.readFileSync(path.join(__dirname, '/data/8.jpg')), 'test.jpg')
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end((err, res) => {
          if (err) done(err)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('picture').includes('https://fanelli.s3.amazonaws.com/test/fotos_colaboradores/')
          done()
        })
    })
  })
  describe('Manage credentials', () => {
    let userWithCredentialsId = '5aba60ece59f8b6023349d15'
    beforeEach((done) => {
      userModel
        .remove({_id: userWithCredentialsId})
        .then(userModel
          .create({
            _id: userWithCredentialsId,
            legajo: 90,
            name: 'nombre',
            'auth.username': 'username',
            'auth.password': 'password'
          })
          .then(() => done())
          .catch(done)
        )
    })

    it('should edit (add) credentials', function (done) {
      chai.request(server)
        .put('/api/user/' + userWithCredentialsId + '/credentials')
        .send({password: 'foo', username: 'bar', user_type: 'SUPERVISOR_PRODUCCION'})
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end(async((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          const user = awaitFor(userModel.findById(userWithCredentialsId))
          expect(user.auth).to.have.property('username').eql('bar')
          done()
        }))
    })

    it('should not edit credentials', function (done) {
      chai.request(server)
        .put('/api/user/' + userWithCredentialsId + '/credentials')
        .send({password: 'foo', username: 'bar', user_type: 'SUPERVI3SOR'})
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end(async((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(false)
          done()
        }))
    })

    it('should revoke credentials', function (done) {
      chai.request(server)
        .post('/api/user/' + userWithCredentialsId + '/revoke')
        .send({userId: userWithCredentialsId})
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.user.should.have.property('auth').to.be.eql({})
          done()
        })
    })
    it('should get the users with credentials', function (done) {
      chai.request(server)
        .get('/api/user/with-credentials')
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('users').to.have.length(6)
          done()
        })
    })
  })
  describe('deactivating users', () => {
    let userToDeactivateId = '5aba60ece59f8b6023349d15'
    beforeEach((done) => {
      userModel
        .remove({_id: userToDeactivateId})
        .then(userModel
          .create({
            _id: userToDeactivateId,
            legajo: 90,
            name: 'nombre',
            'auth.username': 'username',
            'auth.password': 'password'
          })
          .then(() => done())
          .catch(done)
        )
    })
    it('should deactivate an user', function (done) {
      chai.request(server)
        .post(`/api/user/${userToDeactivateId}/deactivate`)
        .send({deactivatedReason: 'reason'})
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end(async((err, res) => {
          if (err) done(err)
          res.body.should.have.property('success').eql(true)
          const user = awaitFor(userModel.find({deactivated: {$ne: true}}))
          expect(user).to.have.length(7)
          done()
        }))
    })
    it('should re activate an user', function (done) {
      chai.request(server)
        .post(`/api/user/${userToDeactivateId}/activate`)
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end(async((err, res) => {
          if (err) done(err)
          res.body.should.have.property('success').eql(true)
          const user = awaitFor(userModel.find({deactivated: {$ne: true}}))
          expect(user).to.have.length(8)
          done()
        }))
    })
  })
  describe('user validation', () => {
    let userToDeactivateId = '5aba60ece59f8b6023349d15'
    beforeEach((done) => {
      userModel
        .remove({_id: userToDeactivateId})
        .then(userModel
          .create({
            legajo: 90,
            dni: 38303,
            name: 'nombre',
            'auth.username': 'username',
            'auth.password': 'password'
          })
          .then(() => done())
          .catch(done)
        )
    })
    it('should validate a legajo', function (done) {
      chai.request(server)
        .get('/api/user/exists/legajo/' + 90)
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end(async((err, res) => {
          if (err) done(err)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('exists').eql(true)
          done()
        }))
    })
    it('should validate a dni', function (done) {
      chai.request(server)
        .get('/api/user/exists/dni/' + 38303)
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end(async((err, res) => {
          if (err) done(err)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('exists').eql(true)
          done()
        }))
    })
  })
  describe('user service', () => {
    beforeEach((done) => {
      userModel
        .remove()
        .then(() => done())
        .catch(done)
    })
    it('should return that there is not user with that sector', async(function () {
      const result = awaitFor(userService.isThereAnyWith({sector: user.sector}))
      expect(result).to.be.false
    }))
    it('should return that there is user with that sector', async(function () {
      const user = factory.user()
      awaitFor(userModel.create(user))
      const result = awaitFor(userService.isThereAnyWith({sector: user.sector}))
      expect(result).to.be.true
    }))
  })
})
