const Sequelize = require('sequelize')
const sequelize = require('../../db')
const Duplicate = require('../duplicates/model')

const Company = sequelize.define('companies', {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.TEXT,
  },
  domain: {
    type: Sequelize.TEXT
  },
  description: {
    type: Sequelize.TEXT
  },
  location: {
    type: Sequelize.TEXT,
  },
  jobCount: {
    type: Sequelize.INTEGER,
  },
  applicationCount: {
    type: Sequelize.INTEGER,
  },
  interviewCount: {
    type: Sequelize.INTEGER,
  },
  offerCount: {
    type: Sequelize.INTEGER,
  },
  jobOfferAfterApplyingRate: {
    type: Sequelize.INTEGER
  }
},
  {
    tableName: 'companies',
    timestamps: false
  }
)

Company.hasMany(Duplicate)

module.exports = Company 