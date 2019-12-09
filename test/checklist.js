'use strict'
// Require the dev-dependencies
const path = require('path')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require(path.join(__dirname, '/../index'))
let checklistModel = require(path.join(__dirname, '/../model/')).checklist
let users = require(path.join(__dirname, '/data/users'))
let checks = require(path.join(__dirname, '/data/check'))
let checkModel = require(path.join(__dirname, '/../model/')).check
chai.use(require('chai-things'))
const _ = require('lodash')
let checklist
const checklistsFilled = require(path.join(__dirname, '/data/checklist'))

/* eslint-disable */
let should = chai.should()
/* eslint-enable */
let checksData

chai.use(chaiHttp)
describe('Checklist', () => {
  before((done) => {
    checkModel.remove({})
    // And fill it with data
      .then(() => checkModel.create(checks))
      .then(checks => {
        checksData = checks
        checklistModel.remove({})
          .then(() => done())
          .catch(error => done(error))
      })
      .catch(error => done(error))
  })

  describe('GET current checklist', () => {
    it('it should get the current checklist (not created)', done => {
      chai.request(server)
        .get('/api/checklist/current/apiladora')
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('checklist')
          res.body.checklist.should.have.property('checks').to.be.not.empty
          checklist = res.body.checklist
          done()
        })
    })
  })
  describe('POST checklist ', () => {
    it('it should add a check', (done) => {
      let check = {
        id: checksData[0]._id,
        value: false,
        comment: 'hola',
        checklist_id: checklist._id
      }
      chai.request(server)
        .post('/api/checklist/')
        .send({check: check})
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('checklist')
          res.body.checklist.should.have.property('supervisor').eql(users.supervisor._id)
          res.body.checklist.should.have.property('checks').to.be.not.empty
          check = _.find(res.body.checklist.checks, c => c.check._id.toString() === checksData[0]._id.toString())
          check.should.have.property('values').to.be.not.empty
          check.should.have.property('comments').to.be.not.empty
          check.should.have.property('last')
          done()
        })
    })
    it('it should add a numeric check', (done) => {
      let check = {
        id: checksData[1]._id,
        value: true,
        extra: 20,
        checklist_id: checklist._id
      }
      chai.request(server)
        .post('/api/checklist/')
        .send({check: check})
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('checklist')
          res.body.checklist.should.have.property('checks').to.be.not.empty
          check = _.find(res.body.checklist.checks, c => c.check._id.toString() === checksData[1]._id.toString())
          check.should.have.property('values').to.be.not.empty
          check.should.have.property('last')
          check.last.should.have.property('extra').eql(20)
          done()
        })
    })
  })
  describe('POST comments', () => {
    it('it should post a check comment', (done) => {
      let comment = {
        id: checksData[0]._id,
        comment: 'comentario',
        checklist_id: checklist._id
      }
      chai.request(server)
        .post('/api/checklist/comment')
        .send({check: comment})
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('checklist')
          let check = _.find(res.body.checklist.checks, c => c.check._id.toString() === checksData[0]._id.toString())
          check.should.have.property('comments').to.be.not.empty
          done()
        })
    })

    it('it should post a checklist comment', (done) => {
      let observation = {
        observation: 'comentario',
        checklist_id: checklist._id
      }
      chai.request(server)
        .post('/api/checklist/observation')
        .send({observation: observation})
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('checklist')
          res.body.checklist.should.have.property('observations').to.be.not.empty
          done()
        })
    })
  })
  describe('GET checks from sector', () => {
    it('it should get the checks from the sector', (done) => {
      chai.request(server)
        .get('/api/checklist/extrusora')
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          done()
        })
    })

    it('it should get the checks from the sector with the values', done => {
      chai.request(server)
        .get('/api/checklist/current/apiladora')
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('checklist')
          res.body.checklist.should.have.property('checks').to.be.not.empty
          let check = _.find(res.body.checklist.checks, c => c.check._id.toString() === checksData[0]._id.toString())
          check.should.have.property('values').to.be.not.empty
          check.should.have.property('last')
          done()
        })
    })
  })

  describe('GET summary', () => {
    before((done) => {
      checklistModel.remove({})
        .then(() => {
          checklistModel
            .create(checklistsFilled.summary)
            .then(() => done())
        })
    })
    describe('GET revision', () => {
      it('should get the revision for a checklist', (done) => {
        chai.request(server)
          .get('/api/checklist/revision/' + checklistsFilled.summary._id)
          .set('authorization', 'Bearer ' + users.jefePlanta.token)
          .end((err, res) => {
            if (err) done(err)
            res.should.have.status(200)
            res.body.should.have.property('success').eql(true)
            res.body.should.have.property('totalChecks').eql(17)
            res.body.should.have.property('completedChecks').eql(8)
            res.body.should.have.property('goodChecks').eql(4)
            res.body.should.have.property('badChecks').eql(4)
            res.body.should.have.property('badComments').eql(2)
            res.body.should.have.property('goodComments').eql(2)
            done()
          })
      })
    })
    describe('GET correction', () => {
      it('should get the correction for a checklist', (done) => {
        chai.request(server)
          .get('/api/checklist/correction/' + checklistsFilled.summary._id)
          .set('authorization', 'Bearer ' + users.jefePlanta.token)
          .end((err, res) => {
            if (err) done(err)
            res.should.have.status(200)
            res.body.should.have.property('success').eql(true)
            res.body.should.have.property('totalChecks').eql(17)
            res.body.should.have.property('completedChecks').eql(12)
            res.body.should.have.property('goodChecks').eql(7)
            res.body.should.have.property('badChecks').eql(1)
            res.body.should.have.property('badComments').eql(1)
            res.body.should.have.property('goodComments').eql(3)
            done()
          })
      })
    })
  })

  describe('GET comparative', () => {
    before((done) => {
      checklistModel.remove({})
        .then(() => {
          checklistModel
            .create(checklistsFilled.comparative)
            .then(() => done())
        })
    })
    it('should get the comparative data', (done) => {
      chai.request(server)
        .get('/api/checklist/comparative/extrusora?date=2017-10-02')
        .set('authorization', 'Bearer ' + users.jefePlanta.token)
        .end((err, res) => {
          if (err) done(err)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('headers')
            .eql([
              {schedule: 'MANIANA', shift: 'T1'},
              {schedule: 'TARDE', shift: 'T4'},
              {schedule: 'NOCHE', shift: 'T3'}])
          res.body.should.have.property('checks').to.have.lengthOf(17)
          res.body.checks.should.all.have.property('comparative')
          res.body.checks.forEach(c => c.comparative.should.have.lengthOf(3))
          res.body.observations.should.have.lengthOf(3)
          done()
        })
    })
  })
})
