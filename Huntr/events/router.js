const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const { baseURL } = require('../constants')

const Event = require('./model');

const token = process.env.API_TOKEN
axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-events', (req, res, next) => {
    axios
        .get(`${baseURL}/events?limit=10000`)
        .then(response => {
            const data = response.data.data

            const allEvents = data.map(entity => {
                
                const name = entity.toList
                    ? entity.toList.name
                    : 'Wishlist'

                const event = {
                    id: entity.id,
                    eventType: entity.eventType,
                    jobId: entity.job.id,
                    memberId: entity.member.id,
                    status: name
                }

                return Event.create(event)
            })

            return Promise.all(allEvents)
        })
        .then(events => {
            res
                .send({ length: events.length })
                .end()
        })
        .catch(error => next(error))
})

//WEBHOOK ENDPOINT
router.post('/events', (req, res, next) => {
    const eventData = req.body
    const member = eventData.member
    const job = eventData.job

    const event = {
        id: eventData.id,
        jobId: job.id,
        memberId: member.id,
        eventType: eventData.eventType,
        status: eventData.toList.name,
    }

    Event
        .create(event)
        .then(event => {
            //ATTENTION! ALWAYS SEND BACK HTTP STATUS CODE 200 TO A WEBHOOK
            res
                .status(200)
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
