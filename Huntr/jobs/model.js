const Sequelize = require('sequelize')
const sequelize = require('../../db')

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
        },
        companyId: {
            type: Sequelize.STRING,
        }
    },
    {
        tableName: 'jobs',
        timestamps: false
    }
)

module.exports = Job