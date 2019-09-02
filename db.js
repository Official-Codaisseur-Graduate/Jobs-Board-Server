const Sequelize = require('sequelize')
require('dotenv').config();

console.log('TOKEN', process.env.API_TOKEN)

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres';

const sequelize = new Sequelize(connectionString, { define: { timestamps: true } })

//WARNING! DO NOT FORCE: TRUE --> ALL THE DATA IN THE EVENTS TABLE WILL BE FOREVER LOST
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Sequelize updated database schema')
  })
  .catch(console.error)

module.exports = sequelize
