const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Member = require('../members/model')
const Job = require('../jobs/model')

const Entry = sequelize.define(
    'entries',
    {
        status: {
            type: Sequelize.STRING,
        },
        wishlistDate: {
            type: Sequelize.DATEONLY
        },
        applicationDate: {
            type: Sequelize.DATEONLY
        },
        interviewDate: {
            type: Sequelize.DATEONLY
        },
        offerDate: {
            type: Sequelize.DATEONLY
        },
        rejectionDate: {
            type: Sequelize.DATEONLY
        }
    }, {
        tableName: 'entries',
        timestamps: true
    }
)

// Entry.belongsTo(Job)
// Entry.belongsTo(Member)

module.exports = Entry