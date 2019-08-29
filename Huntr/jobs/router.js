const { Router } = require('express')
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { baseURL } = require('../constants')
const Job = require('./model')
const { removeDuplicate } = require('./removeDuplicate')
const Company = require('../companies/model')
const Duplicate = require('../duplicates/model')

const router = new Router()

const token = process.env.API_TOKEN
axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-jobs', (req, res, next) => {
    axios
        .get(`${baseURL}/jobs?limit=10000`)
        .then(response => {
            const jobs = response.data.data
            const noDuplicateJobs = removeDuplicate(jobs, 'id')

            const allJobs = noDuplicateJobs.map(job => {
                let jobs = {
                    id: job.id,
                    companyId: job.employer.id || null,
                    title: job.title,
                    employer: job.employer.name,
                    url: job.url
                }

                Company
                    .findOne({
                        where: {
                            name: job.employer.name
                        }
                    })
                    .then(res => {
                        if (res) {
                            jobs.companyId = res.id
                            Job.create(jobs)
                        } else {
                            Duplicate
                                .findOne({
                                    where: {
                                        relatedId: job.employer.id
                                    }
                                })
                                .then(res => {
                                    jobs.companyId = res.companyId
                                    Job.create(jobs)
                                })
                        }
                    })
                    .catch(err => next(err))
            })
            return Promise.all(allJobs)
        })
        .then(jobs => {
            res.send({ length: jobs.length }).end()
        })
        .catch(err => next(err))
})

router.get('/jobs', async (req, res, next) => {
    const page = req.query.page
    const limit = 12
    const offset = page * limit

    const jobs = []

    const searchTitle = req.query.role || ''
    const AllJobsWithTitle = await Job.findAll({
        
        where: {
            title: { [Op.iLike]: `%${searchTitle}%` }
        }
    })

    const searchCity = req.query.city || ''
    const AllCompaniesInCity = await Company.findAll({
        where: {
            location: { [Op.iLike]: `%${searchCity}%` }
        }
    })

    AllJobsWithTitle.map(jobWithTitle => {
        return (AllCompaniesInCity.map(companyInCity => {
            if (jobWithTitle.companyId === companyInCity.id) {
                jobs.push(jobWithTitle)
                return jobWithTitle
            }
        }))
    })

    const count = jobs.length
    const pages = Math.ceil(count/limit)
    const jobsInPage = jobs.slice (offset, offset + limit) 

    res.send({ jobs: jobsInPage, pages })
})

router.get('/jobs/:id', function (req, res, next) {
    const { id } = req.params
    Job
        .findByPk(id)
        .then(job => res.send(job).end())
        .catch(error => next(error))
})

module.exports = router