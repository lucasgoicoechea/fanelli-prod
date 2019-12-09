// Require the dev-dependencies
const path = require('path')
const _ = require('lodash')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require(path.join(__dirname, '/../index'))
let Catalog = require(path.join(__dirname, '/../model/catalog'))
let catalogData = require(path.join(__dirname, '/data/catalog.json'))
let users = require(path.join(__dirname, '/data/users'))
let avalaibles

/* eslint-disable */
let should = chai.should()
/* eslint-enable */

chai.use(chaiHttp)
describe('catalog', () => {
  before((done) => {
    avalaibles = _.filter(catalogData, item => item.available !== false).length
    // Before the test we empty the database
    Catalog.remove({})
    // and load data
      .then(() => Catalog.create(catalogData))
      .then(() => done())
      .catch(error => done(error))
  })
  describe('GET available catalog ', () => {
    it('it should get the available items from the catalog', (done) => {
      chai.request(server)
        .get('/api/catalog/available')
        .set('authorization', 'Bearer ' + users.supervisor.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('catalog').length(avalaibles)
          done()
        })
    })
  })
  describe('GET all catalog ', () => {
    it('it should get all the items from the catalog', (done) => {
      chai.request(server)
        .get('/api/catalog/')
        .set('authorization', 'Bearer ' + users.paniolero.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('catalog').length(catalogData.length)
          done()
        })
    })
  })
  const item = {
    category: 'VESTIMENTA',
    type: 'Remera',
    description: 'Remera',
    model: 'Algodon',
    brand: 'CN Textil',
    certified: false,
    available: true
  }
  describe('POST new item ', () => {
    it('it should post a new item', (done) => {
      chai.request(server)
        .post('/api/catalog/')
        .send({item: item})
        .set('authorization', 'Bearer ' + users.paniolero.token)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200)
          res.body.should.have.property('success').eql(true)
          res.body.should.have.property('item')
          res.body.item.should.have.property('sizes').to.be.not.empty
          done()
        })
    })
  })
})
