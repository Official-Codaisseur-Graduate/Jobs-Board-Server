const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Job = require('./model')
const Company = require('../companies/model')
const Entry = require('../entries/model')

// const Duplicate = require('../duplicates/model')
// const { removeDuplicateCompanies } = require(‘./removeDuplicates’)

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

//
router.post('/copy-jobs', (req, res, next) => {
    axios
        .get(`https://api.huntr.co/org/jobs`)
        .then(response => {
            const data = response.data.data
            
            const allJobs = data.map(entity => {
                console.log("ENTITY!!", entity)
                const job = {
                    id: entity.id,
                    companyId: entity.employer.id,
                    title: entity.title,
                    employer: entity.employer.name,
                    url: entity.url
                }
                //function to check if job already exists
                return (
                    Job
                        .create(job)
                )
            })
            return Promise.all(allJobs)
        })
        .then(jobs => {
            res
                .send({length: jobs.length})
                .end()
    })
})

// const jobAdded = (job, res, next) => {
//     Company
//         .findOne({ where: { id: job.employer.id } })
//         .then(company => {
//             job.companyId = job.employer.id
//             job.address = job.location.address

//             Job
//                 .create(job)
//                 .then(job => res.status(201).json(job))
//                 .catch(error => next(error))
//         })
// };

// router.post('/jobs', function (req, res, next) {
//     const event = req.body;

//     switch (event.eventType) {
//         case 'JOB_ADDED':
//             jobAdded(event.job, res, next);
//             break;
//         case 'JOB_MOVED':
//             break;
//         default:
//             break;
//     }
// })
//         })
//         .catch(error => next(error))
// })

module.exports = router