const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const { baseURL, JOB_ADDED, JOB_MOVED, JOB_APPLICATION_DATE_SET, JOB_FIRST_INTERVIEW_DATE_SET
    , JOB_SECOND_INTERVIEW_DATE_SET, JOB_OFFER_DATE_SET } = require('../constants')

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
router.post('/events', async (req, res, next) => {

    try{

        const eventData = req.body
        const member = eventData.member
        const job = eventData.job
        console.log('TESTING WEBHOOK ENDPOINT')
        const eventType = eventData.eventType

        switch(eventType){
            case JOB_ADDED:
                //Create Event for member if it doesn't exist
                const eventExists = await Event.findOne({
                    where:
                    {
                        jobId: eventData.job.id,
                        memberId: eventData.member.id
                    }
                })

                //Create job and event if event does not exist
                if(!eventExists){
                    const EventToAdd = await Event.create({
                        jobId: job.id,
                        memberId: member.id,
                        eventType: eventData.eventType,
                        status: eventData.toList.name
                    })
                    const JobToAdd = await Job.create({
                        name: eventData.member.givenName,
                        title: eventData.title,
                        employer: eventData.job.location.name,
                        url: eventData.job.url,
                        applicationDate: eventData.applicationDate,
                        firstInterviewDate: eventData.firstInterviewDate,
                        secondInterviewDate: eventData.secondInterviewDate
                    })
                    res.status(200)
                }else{
                    //Update to Event
                    const EventUpdated = await EventExists.update({
                        where:{
                            status: eventData.toList.name
                        }
                    })
                    //Find job to update
                    const jobToUpdate = await Job.findOne({where:
                    {
                        id: eventData.jobId,
                        memberId: eventData.member.id
                    }})
                    //Update job
                    const jobUpdated = await jobToUpdate.update({
                        applicationDate: eventData.applicationDate,
                        firstInterviewDate: eventData.firstInterviewDate,
                        secondInterviewDate: eventData.secondInterviewDate
                    })
                    res.status(200)
                }
                break;

            case JOB_APPLICATION_DATE_SET:
                //update
                const JobToUpdate = await Job.findByPk(eventData.job.id)
                const JobUpdated = await JobToUpdate.update({
                    applicationDate: eventData.job.applicationDate
                })
                break;
            case JOB_FIRST_INTERVIEW_DATE_SET:
                const JobToUpdate = await Job.findByPk(eventData.job.id)
                const JobUpdated = await JobToUpdate.update({
                    firstInterviewDate: eventData.job.firstInterviewDate
                })
                //update
                break;
            case JOB_MOVED:
                //update status of job
                const eventToUpdate = await Event.findOne({
                    where:{
                        jobId: eventData.job.id,
                        memberId: eventData.member.id
                    }
                })
                const eventUpdated = await eventToUpdate.update({
                    status: eventData.toList.name //update status from to
                })
                res.status(200)
                break;
            case JOB_OFFER_DATE_SET:
                //update
                const JobToUpdate = await Job.findByPk(eventData.job.id)
                const JobUpdated = await JobToUpdate.update({
                    offerDate: eventData.job.offerDate
                })
                res.status(200)
                break;
            case JOB_SECOND_INTERVIEW_DATE_SET:
                //update
                const JobToUpdate = await Job.findByPk(eventData.job.id)
                const JobUpdated = await JobToUpdate.update({
                    secondInterviewDate: eventData.job.secondInterviewDate
                })
                res.status(200)
                break;
            default:
                res.status(404).send('Unknown event type')
        }
    }
    catch {
        error => next(error)
    }
})

router.get('/events', (req, res, next) => {
    console.log('TESTING GET ENDPOINT')
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
