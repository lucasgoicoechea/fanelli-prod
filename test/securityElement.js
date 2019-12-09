'use strict'
// Require the dev-dependencies
const path = require('path')
let chai = require('chai')
let chaiHttp = require('chai-http')
const expect = chai.expect
let server = require(path.join(__dirname, '/../index'))
let securityElementModel = require(path.join(__dirname, '../model/')).securityElement
let securityElementService = require(path.join(__dirname, '../service/')).securityElement
let users = require(path.join(__dirname, '/data/users'))
const ObjectId = require('mongoose').Types.ObjectId
const dateFns = require('date-fns')
const config = require(path.join(__dirname, '../config/'))
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')

/* eslint-disable */
let should = chai.should()
/* eslint-enable */
let request = {
  collaborator: users.colaborador._id,
  items: [
    {
      type: 'Casco',
      description: 'Casco de seguridad',
      colour: 'Amarillo',
      model: 'Millenium',
      brand: 'Libus',
      certified: true,
      cant: 3
    },
    {
      type: 'Guantes',
      description: 'Guantes',
      model: 'Nitrilo',
      brand: 'DPS',
      certified: true,
      cant: 1
    },
    {
      type: 'Ropa',
      description: 'Camisa',
      colour: 'Azul',
      model: 'Grafa',
      brand: 'CN Textil',
      certified: false,
      size: '38',
      cant: 2
    }],
  request_date: Date.now()
}
chai.use(chaiHttp)
describe('request security element as jefe', () => {
  before((done) => {
    // Before the test we empty the database
    securityElementModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })
  it('it should save the request already approved', (done) => {
    chai.request(server)
      .post('/api/security-element/')
      .send({request: request})
      .set('authorization', 'Bearer ' + users.jefePlanta.token)
      .end((err, res) => {
        if (err) done(err)
        res.should.have.status(200)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('request')
        res.body.request.supervisor.should.have.property('_id').eql(users.jefePlanta._id)
        res.body.request.should.have.property('approved').eql(true)
        done()
      })
  })
})

describe('request security element', () => {
  before((done) => {
    // Before the test we empty the database
    securityElementModel.remove({})
      .then(() => done())
      .catch(error => done(error))
  })
  describe('POST new request ', () => {
    it('it should save the request', (done) => {
      chai.request(server)
        .post('/api/security-element/')
        .send({request: request})
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('request')
          res.body.request.supervisor.should.have.property('_id').eql(users.supervisor._id)
          res.body.request.should.have.property('_id')
          request.id = res.body.request._id
          done()
        })
    })
  })

  describe('Get pending resolved', () => {
    it('should not get any result', (done) => {
      chai.request(server)
        .get('/api/security-element/pending-resolution')
        .set('authorization', 'Bearer ' + users.paniolero.token)
        .end((error, res) => {
          if (error) return done(error)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('requests').to.be.empty
          done()
        })
    })
  })
})

describe('POST approve request', () => {
  it('it should approve the request', (done) => {
    chai.request(server)
      .post('/api/security-element/approval/' + request.id)
      .send({approved: true})
      .set('authorization', 'Bearer ' + users.jefePlanta.token)
      .end((err, res) => {
        if (err) return done(err)
        res.should.have.status(200)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('message').eql('Solicitud aprobada')
        res.body.should.have.property('request')
        res.body.request.should.have.property('approved').eql(true)
        res.body.request.approved_by.should.have.property('_id').eql(users.jefePlanta._id)
        done()
      })
  })
})

describe('Get pending resolved', () => {
  it('should get results', (done) => {
    chai.request(server)
      .get('/api/security-element/pending-resolution')
      .set('authorization', 'Bearer ' + users.paniolero.token)
      .end((error, res) => {
        if (error) return done(error)
        res.should.have.status(200)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('requests').to.be.not.empty
        done()
      })
  })
})

describe('Get PDF', () => {
  it('should get the PDF', (done) => {
    chai.request(server)
      .get('/api/security-element/get-pdf/' + request.id)
      .set('authorization', 'Bearer ' + users.paniolero.token)
      .end((error, res) => {
        if (error) return done(error)
        res.should.have.status(200)
        res.should.have.header('content-type', 'application/pdf')
        done()
      })
  })
})

describe('Get solved', () => {
  it('should get the request solved', (done) => {
    chai.request(server)
      .get('/api/security-element/solved')
      .set('authorization', 'Bearer ' + users.paniolero.token)
      .end((error, res) => {
        if (error) return done(error)
        res.should.have.status(200)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('requests').to.be.not.empty
        res.body.requests[0].should.have.property('_id').eql(request.id)
        done()
      })
  })
})

describe('Post delivered', () => {
  it('it should set the request as delivered', (done) => {
    chai.request(server)
      .post('/api/security-element/delivered/' + request.id)
      .send({delivered: true})
      .set('authorization', 'Bearer ' + users.paniolero.token)
      .end((error, res) => {
        if (error) return done(error)
        res.should.have.status(200)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('request')
        res.body.request.should.have.property('delivered').eql(true)
        done()
      })
  })
})

describe('Get Delivered', () => {
  it('get the requests delivered', (done) => {
    chai.request(server)
      .get('/api/security-element/delivered')
      .set('authorization', 'Bearer ' + users.paniolero.token)
      .end((error, res) => {
        if (error) return done(error)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('requests').to.be.not.empty
        res.body.requests[0].should.have.property('_id').eql(request.id)
        done()
      })
  })
})

describe('Get specific', () => {
  it('should get epp request done to collaborator', (done) => {
    chai.request(server)
      .get('/api/security-element/to/' + users.colaborador._id)
      .set('authorization', 'Bearer ' + users.supervisor.token)
      .end((error, res) => {
        if (error) return done(error)
        res.should.have.status(200)
        res.body.should.have.property('success').eql(true)
        res.body.should.have.property('requests').to.be.not.empty
        done()
      })
  })
})

describe('Get specific epps', () => {
  const supervisorId = new ObjectId()
  const collaboratorId = new ObjectId()
  const epps = [
    // Recent Epp done by the supervisor to the collaborator
    {supervisor: supervisorId, collaborator: collaboratorId, created_at: new Date(), request_date: new Date()},
    // Recent Epp done by the supervisor to a collaborator
    {supervisor: supervisorId, collaborator: new ObjectId(), created_at: new Date(), request_date: new Date()},
    // Recent Epp approved
    {supervisor: new ObjectId(), collaborator: new ObjectId(), created_at: new Date(), request_date: new Date(), approved_by: new ObjectId(), approved: true},
    // Not recent Epp done by the supervisor to the collaborator
    {supervisor: supervisorId, collaborator: collaboratorId, request_date: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2), created_at: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2)},
    // Epp delivered done by the supervisor to the collaborator
    {supervisor: supervisorId, collaborator: collaboratorId, delivered: true, request_date: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2), created_at: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2)},
    // Epp delivered done by a supervisor to the collaborator
    {supervisor: new ObjectId(), collaborator: collaboratorId, delivered: true, request_date: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2), created_at: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2)},
    // Epp rejected done by the supervisor to the collaborator
    {supervisor: supervisorId, collaborator: collaboratorId, approved: false, request_date: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2), created_at: dateFns.subMilliseconds(new Date(), config.EPP_EDIT_WINDOW * 2)}]

  beforeEach(done => {
    securityElementModel
      .remove({})
      .then(() => securityElementModel.create(epps))
      .then(() => done())
  })
  after(done => {
    securityElementModel.remove({})
      .then(() => done())
  })
  it('should get the active epps', async(function () {
    const activeSecurityElement = awaitFor(securityElementService.getActive({offset: 0, perPage: 15}))
    expect(activeSecurityElement).to.have.lengthOf(3)
  }))

  it('should get epps done by me active', async(function () {
    const SecurityElementByMe = awaitFor(securityElementService.getActiveByUser(supervisorId, {offset: 0, perPage: 15}, {collaborator: collaboratorId}))
    expect(SecurityElementByMe).to.have.lengthOf(2)
  }))


  it('should get epps delivered', async(function () {
    const SecurityElementDelivered = awaitFor(securityElementService.getDelivered({}, {collaborator: collaboratorId}))
    expect(SecurityElementDelivered).to.have.lengthOf(2)
  }))
})
