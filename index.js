const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const huntrRouter = require('./Huntr/companies/routes')
const indeedRouter = require('./Indeed/routes')

const app = express()
const port = process.env.PORT || 4000
app
  .use(cors())
  .use(bodyParser.json())
  .use(huntrRouter, indeedRouter)
  .listen(port, () => console.log(`Listening on port ${port}`))

