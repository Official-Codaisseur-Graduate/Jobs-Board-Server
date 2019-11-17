const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Job = require('../jobs/model')
const Sequelize = require('sequelize')
const Member = require('../members/model')
const { baseURL, JOB_ADDED, JOB_MOVED, JOB_APPLICATION_DATE_SET, JOB_FIRST_INTERVIEW_DATE_SET
    , JOB_SECOND_INTERVIEW_DATE_SET, JOB_OFFER_DATE_SET } = require('../constants')

const Event = require('./model');

//Function to check if event exists
async function findEvent(eventData, job, member){

    eventExists = await Event.findOne({
                where:
                {
                    jobId: job.id,
                    memberId: member.id
                }
            })
    if(eventExists===null){
            const event = {
                id: eventData.id,
                jobId: job.id,
                memberId: member.id,
                eventType: eventData.eventType,
                status: eventData.toList.name
            }
        const EventToAdd = await Event.create(event)
        return eventExists
    }else{
        //check what the status should be updated to
        console.log('The EVENT EXISTS', eventData.eventType === JOB_OFFER_DATE_SET)
        let status = null
        if(eventData.eventType === JOB_APPLICATION_DATE_SET){
            status = "applied"
        }else if(eventData.eventType === JOB_FIRST_INTERVIEW_DATE_SET){
            status = "interview"
        }else if(eventData.eventType === JOB_OFFFER_DATE_SET){
            //this does not set
            status = "offer"
        }
        console.log('UPDATING EVENT', 1500, eventData.eventType === JOB_OFFER_DATE_SET)
        const eventToUpdate = await eventExists.update({     
            eventType: eventData.eventType,
            status: status
        })
    }
}

//function to create new job if it does not exist
async function createOrUpdateJob(eventData, member, job){

    try{
        //Find job to update
        const jobExists = await Job.findOne({where:
            {
                id: job.id,
                memberId: member.id
            }
        })
        console.log('jobExists', jobExists)
        if(!jobExists){
            const JobToAdd = await Job.create({
                id: job.id,
                name: member.givenName,
                title: job.title,
                employer: job.employer? job.employer.name: null,//job.location.name,
                url: job.url,
                memberId: member.id,
                applicationDate: job.applicationDate? new Date(job.applicationDate*1000): null,
                firstInterviewDate: job.firstInterviewDate? new Date(job.firstInterviewDate*1000): null,
                offerDate: job.offerDate? new Date(job.offderDate*1000): null
            })
        }else{
            const jobToUpdate = await jobExists.update({
                applicationDate: job.applicationDate? new Date(job.applicationDate*1000): null,
                firstInterviewDate: job.firstInterviewDate? new Date(job.firstInterviewDate*1000): null,
                secondInterviewDate: job.secondInterviewDate? new Date(job.firstInterviewDate*1000): null,
                offerDate: job.offerDate? new Date(job.offerDate*1000): null
            })
            return jobExists
        }
    }
    catch{
        console.error
    }
}

//function to create new member if member does not exist
async function createOrFindMember(member){

        try{
            const existingMember = await Member.findByPk(member.id) 
            //create if member does not exist
            if(!existingMember){
                const newMember = ({
                    id: member.id,
                    givenName: member.givenName,
                    familyName: member.familyName,
                    email: member.email
                })
                const newMemberCreated = await Member.create(newMember)
            }
        }
        catch{
            console.error
        }
}


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
    const eventType = eventData.eventType
    
    if(eventType=='TEST'){
        console.log("TEST detected")
        res.status(200).send('OK')
        return
    }
    const member = eventData.member
    const job = eventData.job
    console.log('1st eventData', eventData)

    //create member if required at the beginning of the function 3/nov/19
    

    try{
        //find member and create if they don't exist
        const memberExists = await createOrFindMember(member)
        
        const applicationDate=job.applicationDate? new Date(job.applicationDate*1000): null
        const firstInterviewDate = job.firstInterviewDate? new Date(job.firstInterviewDate*1000):null
        const secondInterviewDate = job.secondInterviewDate? new Date(job.secondInterviewDate*1000): null
    
        switch(eventType){
            case JOB_ADDED:
                        console.log("2ND JOB_ADDED", 1000)

                        //Create Event for member if it doesn't exist
                        const eventExists = await findEvent(eventData, job, member)
                        const JobToAdd = await createOrUpdateJob(eventData, member, job)
                        res.status(200).send('OK')

                break;

            case JOB_APPLICATION_DATE_SET:
                console.log('3RD JOB_APPLICATION_DATE_SET', 2000)
                //convert UNIX time stamp to correct date and store
                    const correctDateJADS = new Date(job.applicationDate*1000)
                    const JobToAddOrUpdate = await createOrUpdateJob(eventData, member, job)
                    const eventExistsJADS = await findEvent(eventData, job, member)
                break;

            case JOB_FIRST_INTERVIEW_DATE_SET:
                    console.log('4H JOB_FIRST_INTERVIEW_DATE_SET', 3000)
                    const correctDateJFIDS = new Date(job.firstInterviewDate*1000)
                    const JobToAddOrUpdateJFIDS = await createOrUpdateJob(eventData, member, job)
                    const eventExistsJFIDS = await findEvent(eventData, job, member)

                break;
            case "JOB_MOVED":
                    console.log('5TH JOB_MOVED', 4000)
                    
                try{
                    const eventExists = await findEvent(eventData, job, member)
                    const JobToAdd = await createOrUpdateJob(eventData, member, job)
                    

                }
                catch {
                    console.error
                }
                res.status(200).send('OK')
                break;
            case JOB_OFFER_DATE_SET:
                    console.log('6TH JOB_OFFER_DATE_SET', 5000)

                const JobToAddOrUpdateJODS = await createOrUpdateJob(eventData, member, job)
                const eventExistsJODS = await findEvent(eventData, job, member)

                break;

            case JOB_SECOND_INTERVIEW_DATE_SET:
                    console.log('7TH JOB_SECOND_INTERVIEW_DATE_SET', 6000)
                //update
                const JobToAddOrUpdateSIDS = await createOrUpdateJob(eventData, member, job)
                const eventExistsSIDS = await findEvent(eventData, job, member)
     
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
