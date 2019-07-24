const Sequelize = require('sequelize')
const sequelize = require('../../db')
const Company = require('../companies/model')
// const Duplicate = require('../duplicates/model')
// const Member = require('../members/model');

const Job = sequelize.define('jobs',
    {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: Sequelize.STRING,
        },
        employer: {
            type: Sequelize.JSON,
        },
        url: {
            type: Sequelize.STRING,
        }
    },
    {
        tableName: 'jobs',
        timestamps: false
    }
)

Job.belongsTo(Company)
Company.hasMany(Job)
// Job.hasMany(Member)
// Job.hasMany(Duplicate)

module.exports = Job