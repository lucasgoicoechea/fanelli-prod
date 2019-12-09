'use strict'

class NoDocumentFound extends Error {
  constructor (message, status) {
    // Calling parent constructor of base Error class.
    super(message)

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name

    this.status = status
  }
}

class AppError extends Error {
  constructor (error, message, status) {
    // Calling parent constructor of base Error class.
    super(message)
    this.status = status || 200
    this.error = error
    this.isApp = true
  }

  getPayload () {
    return {success: false, error: this.error, statusCode: this.status, message: this.message}
  }
}

module.exports = {
  NoDocumentFound: NoDocumentFound,
  AppError: AppError

}
