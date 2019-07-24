const Sequelize = require('sequelize')
const sequelize = require('../../db')
// const Duplicate = require('../duplicates/model')
const Company = require('../companies/model')
//
const Member = require('../members/model');

const Job = sequelize.define('jobs', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
    },
    employer: {
        type: Sequelize.STRING,
    },
    url: {
        type: Sequelize.STRING,
    },
    address: {
        type: Sequelize.STRING

    }
},
    {
        tableName: 'jobs',
        timestamps: false
    }
)
Job.belongsTo(Company)
Job.belongsTo(Member)
// Job.hasMany(Duplicate)

module.exports = Job
