//NOTES --> EVENTS = events taht are coming in through the webhook

const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Event = require('./model');
const Entry = require('../entries/model')
const Member = require('../members/model');
const Job = require('../jobs/model');

const { sortData } = require('../entries/functions') //correct way of import & export?

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"
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
                .send({ length: events.length })
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

    sortData(eventData)

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
                        // createdAt: member.createdAt
                    })
                    .then(newMember => {

                    })
                    .catch(error => next(error))
            // } else {
            //     //
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
            // } else {
            //     //
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
                .end()
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

//test
// router.post('/events', (req, res, next) => {
//     Event
//         .create({
//             id: req.body.id,
//             eventType: req.body.eventType,
//             jobId: req.body.jobId,
//             memberId: req.body.memberId
//         })
//         .then(event => {
//             Entry
//                 .create({
//                     status: req.body.status,
//                     jobId: event.jobId,
//                     memberId: event.memberId
//                 })
//                 .then(entry => {
//                     res
//                         .status(201)
//                         .send({
//                             message: "NEW EVENT CREATED & ENTRY",
//                             event: event,
//                             entry: entry
//                         })
//                 })
//                 .catch(error => next(error))

//         })
//         .catch(error => next(error))
// })


module.exports = router