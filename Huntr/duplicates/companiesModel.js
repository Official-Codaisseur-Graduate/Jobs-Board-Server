const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Duplicate = sequelize.define('companiesDuplicates', {
  relatedId: {
    type: Sequelize.STRING
  },
  relatedName: {
    type: Sequelize.TEXT
  },
  companyName: {
    type: Sequelize.TEXT
  }
},
  {
    tableName: 'companiesDuplicates',
    timestamps: false
  }
)

module.exports = Duplicate 