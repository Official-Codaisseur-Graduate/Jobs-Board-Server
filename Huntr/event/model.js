const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Event = sequelize.define(
    'events',
    {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        eventType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }
)

Event.belongsTo(Job);
Event.belongsTo(Member);

module.exports = Event