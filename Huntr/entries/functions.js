//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const Entry = require('../entries/model');
const Job = require('../jobs/model');

    // //what to do with incoming information?!
    // if (data.eventType === "JOB_ADDED") {
    //     //function job added
    //     //check if job exists if not create job
    //     //create entry
    // } else if (data.eventType === "JOB_MOVED") {
    //     //function
    //     //update entry || if not exist create entry
    // } else if (data.eventType === "JOB_APPLICATION_DATE_SET") {
    //     //function
    //     //update entry || if not exist create entry
    // } else if (data.eventType === "JOB_FIRST_INTERVIEW_DATE_SET") {
    //     //function
    //     //update entry || if not exist create entry
    // } else if (data.eventType === "JOB_SECOND_INTERVIEW_DATE_SET") {
    //     //update entry || if not exist create entry
    // } else if (data.eventType === "JOB_OFFER_DATE_SET") {
    //     //update entry || if not exist create entry
    // } else {
    //     //not a correct event name
    // }


export const jobAdded = (event) => {
    const status = event.toList
    const memberId = event.member.id
    const jobId = event.job.id

    const company = {
        //company model
    }

    const job = {
        id: jobId,
        title: event.job.title,
        // employer: event
        url: event.job.url
    }

    const entry = {
        status: status,
        memberId: memberId,
        jobId: jobId
    }

    //check if company exists
    //check if job exists
    //create entry with memberId & jobId
    Job
        .findOne({
            where: {
                id: jobId
            }
        })
        .then(job => {
            if(!job) {
                Job
                    .create(job)
                    .then(newJob => {
                        //send something back? no right?
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
    
    Entry
        .create(entry)
        .then(entry => {
            res
                .status(201)
                .send({
                    message: "A NEW ENTRY WAS CREATED",
                    entry: entry
                })
        })
    


}