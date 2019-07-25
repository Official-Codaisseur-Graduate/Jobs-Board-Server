const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {baseURL, token} = require('../constants')
const Event = require('./model');
const Member = require('../members/model');
const Job = require('../jobs/model');

const { sortData } = require('../entries/functions')

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-events', (req, res, next) => {
    axios
        .get(`${baseURL}/events?limit=10000`)
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
//WHAT ARE ALL THE EVENT TYPES
//CHECKS: MEMBER // JOB // COMPANY //
//MAKE ENTRY
router.post('/events', (req, res, next) => {
    const eventData = req.body

    Event
        .create({
            id: eventData.id,
            eventType: eventData.eventType,
            memberId: eventData.member.id,
            jobId: eventData.job.id
        })
        .then(event => {
            sortData(eventData)
            res.send(event).status(200)
        })
        .catch(error => next(error))
})

router.get('/events', (req, res, next) => {
    Event
        .findAll()
        .then(events => {
            res
                .status(200)
                .send({
                    message: "ALL EVENTS",
                    events: events
                })
        })
        .catch(error => next(error))
})

module.exports = router