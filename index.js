const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const companiesRouter = require('./Huntr/companies/router')
const jobsRouter = require('./Huntr/jobs/router')
const membersRouter = require('./Huntr/members/router')
const entriesRouter = require('./Huntr/entries/router')
const eventsRouter = require('./Huntr/events/router')


const app = express()
const port = process.env.PORT || 4000
app
  .use(cors())
  .use(bodyParser.json())
  .use(companiesRouter, jobsRouter, membersRouter, entriesRouter, eventsRouter)
  .listen(port, () => console.log(`Listening on port ${port}`))

  