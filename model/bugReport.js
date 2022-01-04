const { badData } = require('boom')
const { Db } = require('mongodb')
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
    part: {
        type: String
    },
    sub_part: {
        type: String
    },
    resume: {
        type: String
    },
    timestamps: {
        type: true
    }
})
const BugReportModel = mongoose.model('BugReport', BugReportSchema)
module.exports = BugReportModel