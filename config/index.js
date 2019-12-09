const path = require('path')
const config = {}

// Server configuration
config.port = process.env.PORT || 3000
config.db = {}

/**
 * Delay of notifications that need to wait for a possible edit (like a security element request)
 * @type {int} in milliseconds */
config.EPP_EDIT_WINDOW = 1000 * 60 * 5

config.CHECKLIST_REMINDER = 1000 * 60 * 10
config.EXCULPATORY_REMINDER = 1000 * 60 * 60 * 24
config.TTL_EXCULPATORY_REMINDER = 1000 * 60 * 60 * 24
config.REQUEST_TIME_LIMITATION = 1000 * 60 * 60 * 24

config.wpPrivateKey = process.env.WEB_PUSH_PRIVATE_KEY
config.wpPublicKey = process.env.WEB_PUSH_PUBLIC_KEY
config.aws_access_key_id = process.env.AWS_ACCESS_KEY_ID
config.aws_secret_access_key = process.env.AWS_SECRET_ACESS_KEY
config.BUCKET = 'fanelli'
config.AMAZON_S3_URL = 'https://fanelli.s3.amazonaws.com/'

switch (process.env.NODE_ENV) {
  case 'production':
    require(path.join(__dirname, '/production'))(config)
    break
  case 'development':
    require(path.join(__dirname, '/development'))(config)
    break
  case 'test':
    require(path.join(__dirname, '/test'))(config)
    break
  default:
    require(path.join(__dirname, '/localhost'))(config)
}

module.exports = config
