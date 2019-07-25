//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Member = require('../members/model')
const Job = require('../jobs/model')

const Entry = sequelize.define(
    'entries',
    {
        status: {
            type: Sequelize.STRING,
            defaultValue: "Wishlist"
        },
        wishlistDate: {
            type: Sequelize.DATEONLY,
            // defaultValue: "tbd"
        },
        applicationDate: {
            type: Sequelize.DATEONLY,
            // defaultValue: "tbd"
        },
        firstInterviewDate: {
            type: Sequelize.DATEONLY,
            // defaultValue: "tbd"
        },
        secondInterviewDate: {
            type: Sequelize.DATEONLY
        },
        offerDate: {
            type: Sequelize.DATEONLY,
            // defaultValue: "tbd"
        },
        rejectionDate: {
            type: Sequelize.DATEONLY,
            // defaultValue: "tbd"
        },
        jobId: {
            type: Sequelize.STRING
        },
        memberId: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'entries',
        timestamps: true
    }
)

// Entry.belongsTo(Job)
// Entry.belongsTo(Member)

module.exports = Entry