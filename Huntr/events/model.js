const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Member = require('../members/model')
const Job = require('../jobs/model')

const Event = sequelize.define(
    'events',
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        eventType: {
            type: Sequelize.STRING,
        },
        memberId: {
            type: Sequelize.STRING
        },
        jobId: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATEONLY,
            defaultValue: new Date()
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "Wishlist"
        }
    }, {
        tableName: 'events'
    }
)

module.exports = Event

//NOTES
// Event.belongsTo(Member)
// Event.belongsTo(Job)
// If ^^^ used to form relations -> error -> see issues for more explination