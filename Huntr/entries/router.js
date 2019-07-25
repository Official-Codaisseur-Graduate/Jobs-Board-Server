//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { baseURL, token } = require('../constants')

const Entry = require('./model');

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

//all records of all jobs of all members
router.get('/entries', (req, res, next) => {
    Entry
        .findAll()
        .then(entries => {
            res
                .status(200)
                .send({
                    message: "ALL ENTRIES",
                    entries: entries
                })
        })
        .catch(error => next(error))
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