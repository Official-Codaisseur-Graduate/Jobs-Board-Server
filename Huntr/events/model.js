const Sequelize = require('sequelize')
const sequelize = require('../../db')

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