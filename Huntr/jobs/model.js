const Sequelize = require('sequelize')
const sequelize = require('../../db')
const Company = require('../companies/model')
const Member = require('../members/model');

const Job = sequelize.define('jobs',
    {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: Sequelize.TEXT,
        },
        employer: {
            type: Sequelize.TEXT,
        },
        url: {
            type: Sequelize.TEXT,
        }
    },
    {
        tableName: 'jobs',
        timestamps: false
    }
)

Job.belongsTo(Company)
Company.hasMany(Job)
Job.hasMany(Member)

module.exports = Job