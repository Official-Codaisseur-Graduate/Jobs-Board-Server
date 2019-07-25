//NOTES --> EVENTS = events taht are coming in through the webhook

const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const Event = require('./model');

const { jobAdded, jobMoved, jobStatusDateSet } = require('../entries/functions') //correct way of import & export?

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
//WHAT ARE ALL THE EVENT TYPES --> new member?
router.post('/events', (req, res, next) => {
    const eventType = req.body.eventType //correct? or .data?
    const eventData = req.body
    const event = {
        id: eventData.id,
        eventType: eventData.eventType,
        jobId: data.job.id,
        memberId: data.member.id
    }

    //create event record
    Event
        .create(event)
        .then(event => {
            res
                //webhook expects status 200 back
                .status(200)
                .send({
                    message: "NEW EVENT CREATED",
                    event: event
                })
        })
        .catch(error => next(error))

    // //sort data
    // switch (eventType) {
    //     case "JOB_ADDED":
    //         return (
    //             jobAdded(eventData)
    //         )
    //     case "JOB_MOVED":
    //         return (
    //             jobMoved(eventData)
    //         )
    //     case ("JOB_APPLICATION_DATE_SET" || "JOB_FIRST_INTERVIEW_DATE_SET" || "JOB_OFFER_DATE_SET"):
    //         return (
    //             jobStatusDateSet(eventData)
    //         )
    //     default:
    //         return
    //     //what?
    // }
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

//turn all events into entries
// router.post('/copy-events-entries', (req, res, next) => {
//     axios
//         .get(`https://api.huntr.co/org/events`)
//         .then(response => {
//             const data = response.data.data

//             const allEvents = data.map(entity => {
//                 const eventType = entity.eventType

//                 const eventData = entity
//                 //make entries
//                 switch (eventType) {
//                     case "JOB_ADDED":
//                         return (
//                             jobAdded(eventData)
//                         )
//                     case "JOB_MOVED":
//                         return (
//                             jobMoved(eventData)
//                         )
//                     case ("JOB_APPLICATION_DATE_SET" || "JOB_FIRST_INTERVIEW_DATE_SET" || "JOB_OFFER_DATE_SET"):
//                         return (
//                             jobStatusDateSet(eventData)
//                         )
//                     default:
//                         return
//                     //what?
//                 }
//             })
//             return Promise.all(allEvents)
//         })
//         .then(entries => {
//             res
//                 .send({ length: entries.length })
//                 .end()
//         })
//         .catch(error => next(error))
// })

module.exports = router