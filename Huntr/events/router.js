const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Event = require('./model');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-events', (req, res, next) => {
    axios
        .get(`https://api.huntr.co/org/events`)
        .then(response => {
            const data = response.data.data

            const allEvents = data.map(entity => {
                const event = {
                    id: entity.id,
                    eventType: entity.eventType,
                    createdAt: entity.createdAt,
                    jobId: entity.job.id,
                    memberId: entity.member.id

                }
                return (
                    Event
                        .create(event)
                )
            })
            return Promise.all(allEvents)
        })
        .then(events => {
            res
                .send({length: events.length})
                .end()
        })
        .catch(error => next(error))
})

//WEBHOOK ENDPOINT
//!!EDIT TO SEND TO CORRECT FUNCTION DEPENDING ON EVENTYPE
router.post('/events', (req, res, next) => {
    const data = req.body
    const event = {
        id: data.id,
        eventType: data.eventType,
        createdAt: data.createdAt,
        jobId: data.job.id,
        memberId: data.member.id
    }

    Event
        .create(event)
        .then(event => {
            res
                //webhook expects status 200 back
                .status(200)
        })
        .catch(error => next(error))
 })

module.exports = router