const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Member = require('./model')
const {baseURL, token} = require('../constants')

<<<<<<< HEAD
axios.defaults.baseURL = baseURL
=======
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"
axios.defaults.baseURL = 'https://api.huntr.co/org'
>>>>>>> development
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post(`/copy-members`, (req, res, next) => {
    axios
        .get(`${baseURL}/members`)
        .then(response => {
            const data = response.data.data

            const allMembers = data.map(entity => {
                const member = {
                    ...entity
                }
                return (
                    Member
                        .create(member)
                )
            })
            return Promise.all(allMembers)
        })
        .then(members => {
            res
                .send({length: members.length})
                .end()
        })
        .catch(error => next(error))
})

router.get('/members/active', (req,res, next) => {
    Member
        .findAll({
            where: {
                isActive: true
            }
        })
        .then(members => {
            res
                .status(200)
                .send({
                    message: "ALL ACTIVE MEMBERS",
                    members: members,
                    amount: members.length
                })
        })
        .catch(error => next(error))
})

module.exports = router

