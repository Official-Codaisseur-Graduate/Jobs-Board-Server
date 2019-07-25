const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { baseURL, token } = require('../constants')
const Job = require('./model')
const Company = require('../companies/model')
const { removeDuplicate } = require('./removeDuplicates')

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-jobs', (req, res, next) => {
    axios
        .get(`${baseURL}/jobs?limit=10000`)
        .then(response => {
            const jobs = response.data.data
            const noDuplicateJobs = removeDuplicate(jobs, 'id')
            console.log('LENGTH-JOB-DUPLICATE!!', jobs.length, noDuplicateJobs.length)
            console.log('OBJECT-JOB-DUPLICATE', jobs[0], 'duplicate', noDuplicateJobs)

            const allJobs = noDuplicateJobs.map(job => {
                const jobs = {
                    id: job.id,
                    companyId: job.employer.id,
                    title: job.title,
                    employer: job.employer.name,
                    url: job.url
                }

                return Job.create(jobs)
            })
            return Promise.all(allJobs)
        })
        .then(jobs => {
            res.send({ length: jobs.length }).end()
        })
        .catch(err => next(err))
})

// const jobAdded = (job, res, next) => {
//     console.log('job added')
//     console.log('job test', job)
//     console.log('res test', res)
//     Company
//         .findOne({ where: { id: job.employer.id } })
//         .then(company => {
//             console.log('company test', company)

//             job.companyId = job.employer.id
//             job.address = job.location.address

//             console.log('job.companyId', job.employer.id)
//             console.log('job.address', job.location.address)

//             Job
//                 .create(job)
//                 .then(job => res.status(200).json(job))
//                 .catch(error => next(error))
//         })
// }

// const jobMoved = (job, res, next) => {
//     console.log('job moved')
//     console.log('job test', job)
//     console.log('res test', res)
// }

// router.post('/events', function (req, res, next) {
//     const event = req.body;

//     switch (event.eventType) {
//         case 'JOB_ADDED':
//             jobAdded(event.job, res, next);
//             break;
//         case 'JOB_MOVED':
//             jobMoved(event.job, res, next)
//             break;
//         default:
//             break;
//     }
// })

module.exports = router