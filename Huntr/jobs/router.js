const { Router } = require('express')
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { baseURL } = require('../constants')
const Job = require('./model')
const { removeDuplicate } = require('./removeDuplicate')
const Company = require('../companies/model')
const Duplicate = require('../duplicates/model')
const Member = require('../members/model')
const moment = require('moment')

const router = new Router()


const token = process.env.API_TOKEN
axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-jobs/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const data = await axios.get(`${baseURL}/jobs?limit=100000`)
        const jobs = data.data.data

        let noDuplicateJobsFull = removeDuplicate(jobs, 'id')
        if (((id - 1) * 1000) > noDuplicateJobsFull.length) {
            res.send({
                length: 0,
                message: 'No more jobs data available'
            })
                .end()
        }
        else {
            noDuplicateJobs = await Promise.all(noDuplicateJobsFull.slice((id - 1) * 1000, id * 1000))
        }
        const allJobs = noDuplicateJobs.map(async job => {
            const employer = job.employer.id && await Company.findByPk(job.employer.id)

            if (!employer && job.employer.id) {
                await Company.findOrCreate({ where: { id: job.employer.id }, defaults: job.employer })
            }

            const safeCompanyId = job.employer.id || null

            let newJob = {
                id: job.id,
                companyId: safeCompanyId,
                title: job.title,
                employer: job.employer.name || null,
                url: job.url,
                applicationDate: job.applicationDate ? moment.unix(job.applicationDate) : null,
                firstInterviewDate: job.firstInterviewDate ? moment.unix(job.firstInterviewDate) : null,
                secondInterviewDate: job.secondInterviewDate ? moment.unix(job.secondInterviewDate) : null,
                offerDate: job.offerDate ? moment.unix(job.offerDate) : null,
                memberId: job.member.id,

            }
            const jobCreated = await Job.create(newJob)
            return jobCreated
        })
        const createdJobs = await Promise.all(allJobs)

        res.send({
            length: createdJobs.length
        })
            .end()

    }

    catch (error) {
        next(error)
    }
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
    const pages = Math.ceil(count / limit)
    const jobsInPage = jobs.slice(offset, offset + limit)

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