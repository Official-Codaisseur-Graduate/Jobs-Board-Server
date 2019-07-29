const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const { baseURL } = require('../constants')
const Job = require('./model')
const { removeDuplicate } = require('./removeDuplicate')

const token = process.env.token //|| "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"
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

module.exports = router