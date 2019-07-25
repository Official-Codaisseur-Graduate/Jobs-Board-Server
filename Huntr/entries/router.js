//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Entry = require('./model');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

//all records of all jobs of all members
router.get('/entries', (req, res, next) => {
    Entry
        .findAll()
        .then(entries => {
            res
                .status(200)
                .send({
                    message: "ALL ENTRIES",
                    entries: entries
                })
        })
        .catch(error => next(error))
})



 module.exports = router