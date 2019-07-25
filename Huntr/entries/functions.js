//NOTES --> ENTRY = the status of a "jo" in regards to a member 

const Entry = require('../entries/model');
const Job = require('../jobs/model');
const Company = require('../companies/model');

const sortData = (eventData) => {
    const eventType = eventData.eventType

    switch (eventType) {
        case "JOB_ADDED":
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
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()

    const wishlistDate = (status) => {
        if (status === "Wishlist") {
            return date
        } else {
            return null
        }
    }

    // const wishlistDate = null

    const entry = {
        status: status,
        memberId: memberId,
        jobId: jobId,
        wishlistDate: wishlistDate(status)
    }

    Entry
        .create(entry)
        .then(entry => {

        })
        .catch(console.error)
}

const jobMoved = (eventData) => {
    const status = eventData.toList.name
    const memberId = eventData.member.id
    const jobId = eventData.job.id
    const date = new Date()

    // const entry = entryCheck(memberId, jobId)

    const rejectionDate = (status) => {
        if (status === "Rejected") {
            return date
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
                        rejectionDate: rejectionDate(status)
                    })
                    .then(newEntry => {
                        // return newEntry
                    })
                    .catch(console.error)
            } else {
                entity
                    .update({
                        status: status,
                        rejectionDate: rejectionDate(status)
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
    const date = new Date()
    const setDate = eventData.date
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
            if (!entry) {
                Entry
                    .create({
                        jobId: jobId,
                        memberId: memberId,
                        status: eventData.toList.name
                    })
                    .then(entry => {
                        jobStatusDateSet(eventData)
                    })
                    .catch(console.error)
            } else {
                switch (eventType) {
                    case "JOB_APPLICATION_DATE_SET":
                        return (
                            entry
                                .update({
                                    applicationDate: setDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        )
                    case ("JOB_FIRST_INTERVIEW_DATE_SET" || "JOB_SECOND_INTERVIEW_DATE_SET"):
                        return (
                            entry
                                .update({
                                    interviewDate: setDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        )
                    case "JOB_OFFER_DATE_SET":
                        return (
                            entry
                                .update({
                                    offerDate: setDate
                                })
                                .then(entry => {

                                })
                                .catch(console.error)
                        )
                    default:
                        return
                }
            }
        })
        .catch(console.error)
}

module.exports = { sortData }