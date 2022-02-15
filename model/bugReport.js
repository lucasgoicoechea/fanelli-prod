'use strict'
const path = require('path')
const mongoose = require(path.join(__dirname, '/../mongoConnection')).getMongoose()
const Schema = mongoose.Schema


const BugReportSchema = new Schema({
    line: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    sub_sector: {
        type: String,
        required: true   
    },
    equipo: {
        type: String
    },
    group: {
        type: String
    },
    part: {
        type: String
    },
    estado: {
        type: String,
        required: true
    },
    prioridad: {
        type: String
    },
    inconveniente: {
        type: String
    },
    resume: {
        type: String
    } 
    }, {
        timestamps: {
          createdAt: 'created_at',
          updatedAt: 'updated_at'
    }
}) 
const BugReportModel = mongoose.model('BugReport', BugReportSchema)
module.exports = BugReportModel