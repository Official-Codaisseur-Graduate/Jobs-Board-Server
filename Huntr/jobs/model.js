const Sequelize = require('sequelize')
const sequelize = require('../../db')
const Duplicate = require('../duplicates/model')
const Company = require('../companies/model')

const Job = sequelize.define('jobs', {
   id: {
       type: Sequelize.STRING,
       primaryKey: true
   },
   title: {
       type: Sequelize.STRING,
       allowNull: false
   },
   description: {
       type: Sequelize.STRING,
       allowNull: false
   },
   salary: {
       type: Sequelize.INTEGER,
       allowNull: false
   },
   url: {
       type: Sequelize.STRING,
       allowNull: false
   },
   address: {
       type: Sequelize.STRING,
       allowNull: false
   },
   applicationDate: {
       type: Sequelize.INTEGER,
   },
   offerDate: {
       type: Sequelize.INTEGER
   },
   createdAt: {
       type: Sequelize.INTEGER
   }
},
   {
       tableName: 'jobs',
       timestamps: false
   }
)
Job.belongsTo(Company)
Job.hasMany(Duplicate)

module.exports = Job
