const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Duplicate = sequelize.define('jobsDuplicates',
    {
        relatedId: {
            type: Sequelize.STRING
        },
        relatedTitle: {
            type: Sequelize.TEXT
        },
        jobTitle: {
            type: Sequelize.TEXT
        }
    },
    {
        tableName: 'jobsDuplicates',
        timestamps: false
    }
)

module.exports = Duplicate 