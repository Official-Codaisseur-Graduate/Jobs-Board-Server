const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Job = require('./model')
const Duplicate = require('../duplicates/model')
const Company = require('../companies/model')
// const { removeDuplicateCompanies } = require(‘./removeDuplicates’)

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

const jobAdded = (job, res, next) => {
    Company
        .findOne({ where: { id: job.employer.id } })
        .then(company => {
            job.companyId = job.employer.id
            job.address = job.location.address

            Job
                .create(job)
                .then(job => res.status(201).json(job))
                .catch(error => next(error))
        })
};

router.post('/jobs', function (req, res, next) {
    const event = req.body;

    switch (event.eventType) {
        case 'JOB_ADDED':
            jobAdded(event.job, res, next);
            break;
        case 'JOB_MOVED':
            break;
        default:
            break;
    }
})

router.post('/copy-jobs', function (req, res, next) {
    axios.get(`https://api.huntr.co/org/jobs`)
        .then(response => {
            const jobs = response.data.data
            console.log('tatyjobs', jobs[0])
            jobs.map(job => {
                Company
                    .findOne({ where: { id: job.employer.id } })
                    .then(company => {
                        job.companyId = job.employer.id
                        // job.address = job.location.address

                        Job
                            .create(job)
                            .then(job => res.status(201).send('Updated'))
                            .catch(error => next(error))
                    })
            })
        })
        .catch(error => next(error))
})

module.exports = router