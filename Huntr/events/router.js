const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {baseURL, token} = require('../constants')
const Event = require('./model');
const Member = require('../members/model');
const Job = require('../jobs/model');

const { sortData } = require('../entries/functions') //correct way of import & export?

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
    const member = eventData.member
    const job = eventData.job

    Member
        .findOne({
            where: {
                id: eventData.member.id
            }
        })
        .then(entity => {
            if(!entity) {
                Member
                    .create({
                        id: member.id,
                        givenName: member.givenName,
                        familyName: member.familyName,
                        email: member.email,
                        createdAt: member.createdAt
                    })
                    .then(newMember => {

                    })
                    .catch(error => next(error))
            } else {
                //
            }
        })
        .catch(error => next(error))
    
    Job
        .findOne({
            where: {
                id: job.id
            }
        })
        .then(entity => {
            if(!entity) {
                Job
                    .create({
                        id: job.id,
                        title: job.title,
                        employer: job.employer.name,
                        url: job.url
                    })
                    .catch(error => next(error))
            } else {
                //
            }
        })
        .catch(error => next(error))
    
    Event
        .create({
            id: eventData.id,
            eventType: eventData.eventType,
            jobId: job.id,
            memberId: member.id
        })
        .then(event => {
            res
                .status(200)
        })
        .catch(error => next(error))
    
    sortData(eventData)

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