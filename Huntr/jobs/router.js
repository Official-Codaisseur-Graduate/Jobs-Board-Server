const { Router } = require('express')
const axios = require('axios')
const Sequelize = require('sequelize')
// const Op = Sequelize.Op
const { baseURL, token } = require('../constants')
const Job = require('./model')
const { removeDuplicate } = require('./removeDuplicate')

const router = new Router()

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-jobs', (req, res, next) => {
    axios
        .get(`${baseURL}/jobs?limit=10000`)
        .then(response => {
            const jobs = response.data.data
            const noDuplicateJobs = removeDuplicate(jobs, 'id')

            const allJobs = noDuplicateJobs.map(job => {
                const jobs = {
                    id: job.id,
                    companyId: job.employer.id ? job.employer.id : null,
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

// router.get('/jobs', function (req, res, next) {
    // const page = req.query.page
    // const sortProperty = req.query.sortBy
    // const limit = 30
    // const applicationCount = req.query.applicationCount
    // const offerCount = req.query.offerCount
    // const offset = page * limit
    // const searchName = req.query.search ?
    // { name: { [Op.like]: `%${req.query.search}%` } }
    // :
    // undefined
    // console.log(req)
    // Job
    //     .findAndCountAll({
    //         limit,
            // offset,
            // order: [[sortProperty, 'DESC']],
            // where: searchName ?
            // searchName
            // :
            // sortProperty === "jobOfferAfterApplyingRate" ?
            // {
            //     applicationCount: {
            //         [Op.gte]: applicationCount ?
            //             applicationCount : 0
            //     }
            // }
            // :
            // {
            //     offerCount: {
            //         [Op.gte]: offerCount ?
            //             offerCount : 0
            //     }
            // }
//         })
//         .then(jobs => {
//             const { count } = jobs
//             // const pages = Math.ceil(count / limit)
//             res.send({ rows: jobs.rows, pages }).end()
//         })
//         .catch(error => next(error))
// })

router.get('/jobs', function (req, res, next) {
    console.log('REQUEST :', req.query)
    const page = req.query.page
    // const sortProperty = req.query.sortBy
    const limit = 30
    // const applicationCount = req.query.applicationCount
    // const offerCount = req.query.offerCount
    const offset = page * limit


    Job
        .findAll()
        .then(jobs => res.status(200).json(jobs))
        .catch(err => next(err))
})

module.exports = router