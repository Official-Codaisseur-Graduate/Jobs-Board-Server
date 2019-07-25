//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const Entry = require('../entries/model');
const Job = require('../jobs/model');
const Company = require('../companies/model');

const sortData = (eventData) => {
    const eventType = eventData.eventType

    console.log("SORTING IS RUNNING", eventData)

    switch(eventType) {
        case "JOB_ADDED":
            console.log("SWITCH JOB ADDED RUNNING")
            return jobAdded(eventData)
        case "JOB_MOVED":
            return jobMoved(eventData)
        case ("JOB_APPLICATION_DATE_SET" || "JOB_FIRST_INTERVIEW_DATE_SET" || "JOB_OFFER_DATE_SET"):
            return jobStatusDateSet(eventData)
        default:
        return
    }
}


const entryCheck = (memberId, jobId) => {
    Entry
        .findOne({
            where: {
                jobId: jobId,
                memberId: memberId
            }
        })
        .then(entity => {
            if (!entity) {
                Entry
                    .create({
                        jobId: jobId,
                        memberId: memberId
                    })
                    .then(newEntry => {
                        return newEntry
                    })
                    .catch(console.error)
            } else {
                return entity
            }
        })
        .catch(console.error)
}

const jobAdded = (eventData) => {
    console.log("RUNNNINGGGG!!")
    // const status = eventData.toList.name
    const status = eventData.status
    // const memberId = eventData.member.id
    const memberId = eventData.memberId
    // const jobId = eventData.job.id
    const jobId = eventData.jobId

    // const wishlistDate = (status) => {
    //     if (status === "Wishlist") {
    //         return eventData.createdAt
    //     } else {
    //         return null
    //     }
    // }
    const wishlistDate = null

    const entry = {
        status: status,
        memberId: memberId,
        jobId: jobId,
        wishlistDate: wishlistDate
    }

    Entry
        .create(entry)
        .then(entry => {
            //
            res
                .status(201)
                .send({
                    message: "NEW ENTRY",
                    entry: entry
                })
        })
        .catch(console.error)
}

const jobMoved = (eventData) => {
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id

    // const entry = entryCheck(memberId, jobId)

    const rejectionDate = (status) => {
        if (status === "Rejected") {
            return eventData.createdAt
        } else {
            return null
        }
    }

    Entry
        .findOne({
            where: {
                jobId: jobId,
                memberId: memberId
            }
        })
        .then(entity => {
            if (!entity) {
                Entry
                    .create({
                        jobId: jobId,
                        memberId: memberId,
                        status: "Rejected",
                        rejectionDate: rejectionDate
                    })
                    .then(newEntry => {
                        return newEntry
                    })
                    .catch(console.error)
            } else {
                entity
                    .update({
                        status: status,
                        rejectionDate: rejectionDate
                    })
                    .then(updateEntity => {

                    })
                    .catch(console.error)
            }
        })
        .catch(console.error)
}

const jobStatusDateSet = (eventData) => {
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = eventData.date
    const eventType = eventData.eventType

    // const entry = entryCheck(memberId, jobId)

    Entry
        .findOne({
            where: {
                jobId: jobId,
                memberId: memberId
            }
        })
        .then(entry => {
            //if(!entry) {
                //make new entry
            // }
            switch (eventType) {
                case "JOB_APPLICATION_DATE_SET":
                    return (
                        entry
                            .update({
                                applicationDate: date
                            })
                            .then(entry => {
        
                            })
                            .catch(error => next(error))
                    )
                case ("JOB_FIRST_INTERVIEW_DATE_SET" || "JOB_SECOND_INTERVIEW_DATE_SET"):
                    return (
                        entry
                            .update({
                                interviewDate: date
                            })
                            .then(entry => {
        
                            })
                            .catch(error => next(error))
                    )
                case "JOB_OFFER_DATE_SET":
                    return (
                        entry
                            .update({
                                offerDate: date
                            })
                            .then(entry => {
        
                            })
                            .catch(error => next(error))
                    )
                default:
                    return
            }
        })
        .catch(error => next(error))
}

module.exports = { sortData }