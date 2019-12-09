'use strict'
const BSON = require('bson')
const bson = new BSON()

module.exports = {
  deserialize: function (data) {
    let index = 0
    const documents = []
    const options = {}
    // Loop over all documents
    while (index < data.length) {
      // Find size of the document
      const size = data[index] | data[index + 1] << 8 | data[index + 2] << 16 | data[index + 3] << 24
      // Update options with index
      options['index'] = index
      // Parse the document at this point
      documents.push(bson.deserialize(data, options))
      // Adjust index by the document size
      index = index + size
    }
    // Return object containing the list of documents
    return documents
  }
}
