//NOTES --> ENTRY = the status of a "jo" in regards to a member 


const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Entry = require('./model');

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

const jobAdded = (job, res, next) => {
    Company
        .findOne({ where: { id: job.employer.id } })
        .then(company => {
            job.companyId = job.employer.id
 
            Job
                .create(job)
                .then(job => res.status(201).json(job))
                .catch(error => next(error))
        })
 };
 
//  router.post('/jobs', function (req, res, next) {
//     const event = req.body;
//     console.log('Jobs test', event.job);
//     console.log('event type', event.eventType);
 
//     switch (event.eventType) {
//         case 'JOB_ADDED':
//             jobAdded(event.job, res, next);
//             break;
//         case 'JOB_MOVED':
//             break;
//         default:
//             break;
//     }
//  })

 

 module.exports = router