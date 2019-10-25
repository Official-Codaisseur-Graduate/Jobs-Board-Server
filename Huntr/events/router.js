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
    const eventData = req.body
    console.log('WEBHOOK ENDPOINT', 10000000 ,eventData)

    try{
        const member = eventData.member
        const job = eventData.job
        const eventType = eventData.eventType
        console.log('MEMBERID', member)
        
        switch(eventType){
            case JOB_ADDED:
                try{
                        //Create Event for member if it doesn't exist
                        const applicationDate=job.applicationDate? new Date(job.applicationDate*1000): null
                        const firstInterviewDate = job.firstInterviewDate? new Date(job.firstInterviewDate*1000):null
                        const secondInterviewDate = job.secondInterviewDate? new Date(job.secondInterviewDate*1000): null
                        const eventExists = await Event.findOne({
                            where:
                            {
                                jobId: job.id,
                                memberId: member.id
                            }
                        })
                        //Create job and event if event does not exist
                        if(eventExists===null){
                    
                            const event = {
                                id: eventData.id,
                                jobId: job.id,
                                memberId: member.id,
                                eventType: eventType,
                                status: eventData.toList.name
                            }
                            const EventToAdd = await Event.create(event)
                            const JobToAdd = await Job.create({
                                id: job.id,
                                name: eventData.member.givenName,
                                title: job.title,
                                employer: job.employer? job.employer.name: null,//job.location.name,
                                url: job.url,
                                //memberId: member.id, //added 1502 25 Oct 19
                                applicationDate: applicationDate,
                                firstInterviewDate: firstInterviewDate,
                                secondInterviewDate: secondInterviewDate
                            })
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
                            }
                        })
                        //Update job
                        const jobUpdated = await jobToUpdate.update({
                            applicationDate: applicationDate, //eventData.applicationDate,
                            firstInterviewDate: firstInterviewDate, //eventData.firstInterviewDate,
                            secondInterviewDate: secondInterviewDate //eventData.secondInterviewDate
                        })
                        res.status(200).send('OK')
                    }
            }
            catch
            {
                console.error
            }
                break;

            case JOB_APPLICATION_DATE_SET:
                console.log('JOB_APPLICATION_DATE_SET')
                //convert UNIX time stamp to correct date and store
                try{
                    const correctDateJADS = new Date(job.applicationDate*1000)
                    const JobToUpdate = await Job.findByPk(job.id)
                    const JobUpdated = await JobToUpdate.update({
                        applicationDate: correctDateJADS//job.applicationDate
                    })
                    const eventExistsJADS = await Event.findOne({
                        where:
                        {
                            jobId: job.id,
                            memberId: member.id
                        }
                    })
                    //update event
                    const eventUpdatedJADS = eventExistsJADS.update({
                        status: "applied"
                    })
                }
                catch{
                    console.error
                }
                break;

            case JOB_FIRST_INTERVIEW_DATE_SET:

                try{
                    const correctDateJFIDS = new Date(job.firstInterviewDate*1000)
                    const JobToUpdateF = await Job.findByPk(job.id)
                    const JobUpdatedF = await JobToUpdateF.update({
                        firstInterviewDate: correctDateJFIDS
                    })
                    //update Event
                    const eventExistsJFIDS = await Event.findOne({
                        where:
                        {
                            jobId: job.id,
                            memberId: member.id
                        }
                    })
                    //update event
                    const eventUpdatedJFIDS = eventExistsJFIDS.update({
                        status: "1st Interview"
                    })
                }
                catch{
                    console.error
                }
                break;
            case "JOB_MOVED":
                //update status of job
                console.log("JOB_MOVED")
                //code added
                try{
                    const eventToUpdate = await Event.findOne({
                        where:{
                            jobId: eventData.job.id,
                            memberId: eventData.member.id
                        }
                    })
    
                    const eventUpdated = await eventToUpdate.update({
                        status: eventData.toList.name //update status from to
                    })
                    const jobToUpdateJM = await Job.findByPk(job.id)
                    console.log('JOB MOVED job.applicationDate firstInterviewDate secondInterviewDate', job.applicationDate, job.firstInterviewDate, job.secondInterviewDate)
                    if(job.secondInterviewDate){
                        const jobUpdateJM = await jobToUpdateJM.update(
                            {
                                secondInterviewDate: new Date(job.secondInterviewDate*1000)
                            }
                        )

                    }else if(job.firstInterviewDate){
                        const jobUpdateJM = await jobToUpdateJM.update(
                            {
                                firstInterviewDate: new Date(job.firstInterviewDate*1000)
                            }
                        )
                    } else {
                        const jobUpdateJM = await jobToUpdateJM.update(
                            {
                                applicationDate: new Date(job.applicationDate*1000),
                                //firstInterviewDate: new Date(job.firstInterviewDate*1000),
                                //secondInterviewDate: secondInterviewDate || new Date(job.secondInterviewDate*1000)
                            }
                        )
                    }
                }
                catch{
                    console.error
                }
            
                res.status(200).send('OK')
                break;
            case JOB_OFFER_DATE_SET:
                //update
                const JobToUpdateDS = await Job.findByPk(eventData.job.id)
                const JobUpdatedDS = await JobToUpdateDS.update({
                    offerDate: new Date(eventData.date*1000)
                })

                const eventExistsJODS = await Event.findOne({
                    where:
                    {
                        jobId: job.id,
                        memberId: member.id
                    }
                })
                //update event
                console.log('JOB_OFFER_DATE_SET', eventExistsJODS)
                const eventUpdatedJODS = eventExistsJODS.update({
                    status: "offer"
                })
                res.status(200).send('OK')
                break;
            case JOB_SECOND_INTERVIEW_DATE_SET:
                //update
                const JobToUpdateIDS = await Job.findByPk(job.id)
                const JobUpdatedIDS = await JobToUpdateIDS.update({
                    secondInterviewDate: new Date(job.secondInterviewDate*1000)
                })
                console.log('JOB_SECOND_INTERVIEW_DATE_SET', JobToUpdateIDS)
                const eventExistsJSIDS = await Event.findOne({
                    where:
                    {
                        jobId: job.id,
                        memberId: member.id
                    }
                })
                //update event
                const eventUpdatedJSIDS = eventExistsJSIDS.update({
                    status: "2nd Interview"
                })
                res.status(200).send('OK')
                break;
            case "TEST":
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
