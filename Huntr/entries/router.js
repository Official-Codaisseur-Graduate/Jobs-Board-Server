const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {baseURL, token} = require('../constants')

const Entry = require('./model');

axios.defaults.baseURL = baseURL
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