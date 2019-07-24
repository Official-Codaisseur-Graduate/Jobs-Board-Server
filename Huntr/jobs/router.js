const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {baseURL, token} = require('../constants')
const Job = require('./model')
const Company = require('../companies/model')

// const Duplicate = require('../duplicates/model')
// const { removeDuplicateCompanies } = require(‘./removeDuplicates’)

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-jobs', (req, res, next) => {
    axios
        .get(`${baseURL}/jobs`)
        .then(response => {
            const jobs = response.data.data

            const allJobs = jobs.map(entity => {
                const job = {
                    id: entity.id,
                    companyId: entity.employer.id,
                    title: entity.title,
                    employer: entity.employer.name,
                    url: entity.url
                }

                //function to check if job already exists

                // return Job.create(job)
            })

            return Promise.all(allJobs)
        })
        .then(jobs => {
            res.send({ length: jobs.length }).end()
        })
        .catch(err => next(err))
})

const jobAdded = (job, res, next) => {
    console.log('job added')
    console.log('job test', job)
    console.log('res test', res)
    Company
        .findOne({ where: { id: job.employer.id } })
        .then(company => {
            console.log('company test', company)

            job.companyId = job.employer.id
            job.address = job.location.address

            console.log('job.companyId', job.employer.id)
            console.log('job.address', job.location.address)

            Job
                .create(job)
                .then(job => res.status(200).json(job))
                .catch(error => next(error))
        })
}

const jobMoved = (job, res, next) => {
    console.log('job moved')
    console.log('job test', job)
    console.log('res test', res)
}

router.post('/events', function (req, res, next) {
    const event = req.body;

    switch (event.eventType) {
        case 'JOB_ADDED':
            jobAdded(event.job, res, next);
            break;
        case 'JOB_MOVED':
            jobMoved(event.job, res, next)
            break;
        default:
            break;
    }
})

module.exports = router