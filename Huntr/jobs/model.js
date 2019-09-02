const Sequelize = require('sequelize')
const sequelize = require('../../db')
const Company = require('../companies/model')

const Job = sequelize.define('jobs',
    {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.TEXT,
        },
        title: {
            type: Sequelize.TEXT,
        },
        employer: {
            type: Sequelize.TEXT,
        },
        url: {
            type: Sequelize.TEXT,
        },
        applicationDate: {
            type: Sequelize.DATE
        },
        firstInterviewDate: {
            type: Sequelize.DATE
        },
        secondInterviewDate: {
            type: Sequelize.DATE,
        },
        offerDate: {
            type: Sequelize.DATE
        },

    },
    {
        tableName: 'jobs',
        timestamps: false
    }
)

Job.belongsTo(Company, { constraints: false })
Company.hasMany(Job)

module.exports = Job