const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Entry = sequelize.define(
    'entries',
    {
        status: {
            type: Sequelize.STRING,
            defaultValue: "Wishlist"
        },
        wishlistDate: {
            type: Sequelize.DATEONLY,
        },
        applicationDate: {
            type: Sequelize.DATEONLY,
        },
        firstInterviewDate: {
            type: Sequelize.DATEONLY,
        },
        secondInterviewDate: {
            type: Sequelize.DATEONLY
        },
        offerDate: {
            type: Sequelize.DATEONLY,
        },
        rejectionDate: {
            type: Sequelize.DATEONLY,
        },
        jobId: {
            type: Sequelize.STRING
        },
        memberId: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATEONLY,
            defaultValue: new Date()
        },
        updatedAt: {
            type: Sequelize.DATEONLY,
            defaultValue: new Date()
        }

    }, {
        tableName: 'entries'
    }
)

module.exports = Entry