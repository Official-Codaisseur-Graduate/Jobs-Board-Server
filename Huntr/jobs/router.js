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

const router = new Router()

const token = process.env.API_TOKEN
axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-jobs', async (req, res, next) => {
    try {
        const data = await axios.get(`${baseURL}/jobs?limit=100000`)
        const jobs = data.data.data
        const noDuplicateJobs = removeDuplicate(jobs, 'id')
        const allJobs = noDuplicateJobs.map(async job => {
            console.log('job.employer.id test:', job.employer.id)
            const employer = job.employer.id && await Company.findByPk(job.employer.id)

            if (!employer && job.employer.id) {
                console.log('employer test:', employer)
                console.log('job.employer test:', job.employer)
                await Company.create(job.employer)
            }

            const safeCompanyId = job.employer.id || null
            if (!safeCompanyId) {
                console.log('safeCompanyId test:', safeCompanyId)
            }

            let newJob = {
                id: job.id,
                companyId: safeCompanyId,
                title: job.title,
                url: job.url,
                applicationDate: job.applicationDate,
                firstInterviewDate: job.firstInterviewDate,
                secondInterviewDate: job.secondInterviewDate,
                offerDate: job.offerDate,
                memberId: job.member.id,

            }

            const created = await Job.create(newJob)

            console.log('created test:', created)

            return created
        })
        const createdJobs = await Promise.all(allJobs)
        res.send({
                length: createdJobs.length
            })
            .end()
    } catch (error) {
        console.log('I am error', error)
        next(error)
    }
})

router.get('/jobs', function (req, res, next) {
    const page = req.query.page || 1
    const sortProperty = req.query.sortBy || 'title'
    const searchName = req.query.search ?
        { name: { [Op.like]: `%${req.query.search}%` } } : ''
    const limit = 30
    const offset = 8 * limit

    Job
        .findAndCountAll({
            limit,
            offset,
            order: [[sortProperty, 'ASC']],
            where: searchName
        })
        .then(jobs => {
            const { count } = jobs
            const pages = Math.ceil(count / limit)
            res.send({ rows: jobs.rows, pages }).end()
        })
        .catch(error => next(error))
})

router.get('/jobs/:id', function (req, res, next) {
    const { id } = req.params
    Job
        .findByPk(id)
        .then(job => res.send(job).end())
        .catch(error => next(error))
})


module.exports = router