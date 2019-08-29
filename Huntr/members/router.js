const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const { baseURL } = require('../constants')
const Member = require('./model')

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${process.env.token}` }

router.post(`/copy-members`, (req, res, next) => {
    axios
        .get(`${baseURL}/members?limit=10000`)
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

