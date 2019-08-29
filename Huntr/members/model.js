const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Member = sequelize.define(
    'member',
    {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        givenName: {
            type: Sequelize.STRING
        },
        familyName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: new Date()
        }
    }, {
        timestamps: false,
        tableName: 'members'
    }
)

module.exports = Member