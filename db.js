const Sequelize = require('sequelize')

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres';

const sequelize = new Sequelize(connectionString, { define: { timestamps: true } })

sequelize
  .sync({alter:true})
  // .sync({force:true})
  .then(() => {
    console.log('Sequelize updated database schema')
  })
  .catch(console.error)

module.exports = sequelize