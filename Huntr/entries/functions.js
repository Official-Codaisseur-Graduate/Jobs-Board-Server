//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const Entry = require('../entries/model');
const Job = require('../jobs/model');
const Company = require('../companies/model');

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

export const jobAdded = (eventData) => {
    const status = eventData.toList
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const wishlistDate = (status) => {
        if(status === "Wishlist") {
            return eventData.createdAt
        } else {
            return null
        }
    }

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
        jobId: jobId,
        wishlistDate: wishlistDate
    }

    Job
        .findOne({
            where: {
                id: jobId
            }
        })
        .then(entity => {
            if (!entity) {
                Job
                    .create(job)
                    .then(newJob => {

                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))

    Entry
        .create(entry)
        .then(entry => {

        })
        .catch(error => next(error))
}

export const jobMoved = (eventData) => {
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const entry = entryCheck(memberId, jobId)
    const rejectionDate = (status) => {
        if(status === "Rejected") {
            return eventData.createdAt
        } else {
            return null
        }
    }

    entry
        .update({
            status: status,
            rejectionDate: rejectionDate
        })
        .then(updateEntity => {

        })
        .catch(error => next(error))
}

export const jobStatusDateSet = (eventData) => {
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = eventData.date
    const entry = entryCheck(memberId, jobId)

    switch (event.eventType) {
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
}

module.exports = { jobAdded, jobMoved, jobStatusDateSet }