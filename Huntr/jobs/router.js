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

// jobs1 endpoint filtering working
// router.get('/jobs', function (req, res, next) {
//     console.log('****************searchJobs query » /jobs request.query:', req.query)

//     const page = req.query.page || 1
//     const sortProperty = req.query.sortBy || 'title'
//     // ?? `%${req.query.search}%`» 
//     // any number and kind of character befor and after
//     const searchName = req.query.search ? { name: { [Op.like]: `%${req.query.search}%` } } : ''

//     console.log('/jobs searchName:', searchName)    
//     const limit = 30
//     const offset = 8 * limit

//     Job
//         .findAndCountAll({
//             limit,
//             offset,
//             order: [[sortProperty, 'ASC']],
//             where: searchName

//         })
//         .then(jobs => {
//             const { count } = jobs
//             const pages = Math.ceil(count / limit)
//             res.send({ rows: jobs.rows, pages }).end()
//         })
//         .catch(error => next(error))
// })

// new endpoint
router.get('/jobs1', async (req, res, next) => {
    console.log('****************searchJobs query » /jobs request.query:', req.query)

    const searchTitle = req.query.role || ''
    const jobs = []

    // const page = req.query.page
    // const sortProperty = req.query.sortBy
    // const limit = 12
    // const offset = page * limit

    const AllJobsWithTitle = await Job.findAll({
        // limit,
        // offset,
        // order: [[sortProperty, 'ASC']],
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

    // const count = jobs.length
    // const pages = Math.ceil(count/limit)
    // const jobsInPage = jobs.slice (offset, offset + limit) 

    console.log('total number of jobs in the city', jobs.length)
    // res.send({ message: 'total jobs in the city', jobsInPage, pages })
    res.send({ message: 'total jobs in the city', jobs })
})

router.get('/jobs/:id', function (req, res, next) {
    const { id } = req.params
    Job
        .findByPk(id)
        .then(job => res.send(job).end())
        .catch(error => next(error))
})

module.exports = router