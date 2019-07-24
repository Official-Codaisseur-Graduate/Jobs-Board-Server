const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Member = sequelize.define(
    'member',
    {
        id: {
            type: Sequelize.STRING,
            // allowNull: false,
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
        createdAt: {
            type: Sequelize.DATE,
            // allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            // allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'members'
    }
)

module.exports = Member