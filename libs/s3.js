'use strict'
const path = require('path')
const AWS = require('aws-sdk')
const async = require('asyncawait/async')
const awaitFor = require('asyncawait/await')
AWS.config.setPromisesDependency(require('bluebird'))
const config = require(path.join(__dirname, '/../config'))
const myConfig = new AWS.Config({
  region: 'us-east-2',
  credentials: new AWS.Credentials({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key
  })
})

const s3 = new AWS.S3(myConfig)

module.exports = {
  getKey: function (filename) {
    return process.env.NODE_ENV + '/' + filename
  },
  getProfilePictureKey: function (legajo) {
    return this.getKey('fotos_colaboradores/' + legajo + '.jpg')
  },

  saveProfilePicture: function (file, filename) {
    this.save(file, this.getProfilePictureKey(filename))
    return filename
  },
  save: async(function (file, key) {
    awaitFor(s3.putObject({
      Body: file,
      Bucket: config.BUCKET,
      Key: key
    }).promise())
    return key
  }),
  delete: async(function (key) {
    return s3.deleteObject({
      Bucket: config.BUCKET,
      Key: key
    }).promise()
  }),
  get: async(function (fileName) {
    const key = this.getKey(fileName)
    awaitFor(s3.getObject({
      Bucket: config.BUCKET,
      Key: key
    }).promise())
    return key
  })
}
