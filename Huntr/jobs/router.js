const { Router } = require('express')
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { baseURL } = require('../constants')
const Job = require('./model')
const { removeDuplicate } = require('./removeDuplicate')
// const Company = require('../jobs/model')
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

router.get('/jobs', function (req, res, next) {
    console.log('****************searchJobs query » /jobs request.query:', req.query)
    // console.log('****************searchJobs REQ » /jobs request.query:', req)
    const page = req.query.page || 1
    const sortProperty = req.query.sortBy || 'title'
    // ?? `%${req.query.search}%`» 
    // any number and kind of character befor and after
    // 10: const searchName = req.query.search ? { name: { [Op.like]: `%${req.query.search}%` } } : ''
    // maybe » searchRole and searchCity » check the if the db has name column!!!
    const searchName = req.query.search ? { name: { [Op.like]: `%${req.query.search}%` } } : ''
    const searchRole = req.query.role ? { title: { [Op.like]: `%${req.query.role}%` } } : ''
    console.log('/jobs searchName:', searchName)    
    const limit = 30
    const offset = 6 * limit

    Job
        .findAndCountAll({
            limit,
            offset,
            order: [[sortProperty, 'ASC']],
            // where: searchName
            where: [Op.and] [{searchName}, {searchRole}]
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