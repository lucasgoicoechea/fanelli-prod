const { await } = require('asyncawait')
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
    group: {
        type: String
    },
    part: {
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

/*
BugReportModel.create(
    {
        line: '2',
        sector: 'Produccion',
        sub_sector: 'Laminado',
        equipo: 'Laminador Primario LA9 Planta 2',
        group: 'Lado Lento',
        part: 'Motor',
        resume: 'Resumen de Falla'
    }
)*/