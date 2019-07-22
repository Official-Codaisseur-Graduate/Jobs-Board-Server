const Sequelize = require('sequelize')
const sequelize = require('../../db')

const Duplicate = sequelize.define('duplicates', {
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
    tableName: 'duplicates',
    timestamps: false
  }
)

module.exports = Duplicate 