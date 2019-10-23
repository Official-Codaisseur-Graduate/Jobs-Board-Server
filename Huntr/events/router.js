const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Job = require('../jobs/model')
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
        console.log('WEBHOOK ENDPOINT', 10000000 ,req.body)
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
                console.log('eventExists', 10001, eventExists)

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
                    console.log('EventToAdd', 1002, EventToAdd, JobToAdd)
                    res.status(200).send('OK')
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
                    console.log('EventUpdate', 1003, EventUpdated, jobUpdated)
                    res.status(200).send('OK')
                }
                break;

            case JOB_APPLICATION_DATE_SET:
                //update
                const JobToUpdate = await Job.findByPk(eventData.job.id)
                const JobUpdated = await JobToUpdate.update({
                    applicationDate: eventData.job.applicationDate
                })
                console.log('JOB_APPLICATION_DATE_SET', 1004, JobUpdated)
                break;
            case JOB_FIRST_INTERVIEW_DATE_SET:
                const JobToUpdateF = await Job.findByPk(eventData.job.id)
                const JobUpdatedF = await JobToUpdateF.update({
                    firstInterviewDate: eventData.job.firstInterviewDate
                })
                //update
                console.log('JOB_FIRST_INTERVIEW_DATE_SET', 1005, JobUpdatedF)
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
                console.log('JOB_MOVED', eventUpdated)
                res.status(200).send('OK')
                break;
            case JOB_OFFER_DATE_SET:
                //update
                const JobToUpdateDS = await Job.findByPk(eventData.job.id)
                const JobUpdatedDS = await JobToUpdateDS.update({
                    offerDate: eventData.job.offerDate
                })
                console.log('JOB_OFFER_DATE_SET', JobUpdatedIDS)
                res.status(200).send('OK')
                break;
            case JOB_SECOND_INTERVIEW_DATE_SET:
                //update
                const JobToUpdateIDS = await Job.findByPk(eventData.job.id)
                const JobUpdatedIDS = await JobToUpdateIDS.update({
                    secondInterviewDate: eventData.job.secondInterviewDate
                })
                console.log('JOB_SECOND_INTERVIEW_DATE_SET', JobToUpdateIDS)
                res.status(200).send('OK')
                break;
            case "TEST":
                console.log('CASE TEST', 1000, eventData.eventType)
                res.status(200).send('OK')
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
