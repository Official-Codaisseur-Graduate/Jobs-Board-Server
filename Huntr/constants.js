 const baseURL = `https://api.huntr.co/org`
 //  const baseURL = `https://local:4000`
 //Act according to constants - for webhooks
 const JOB_MOVED = "JOB_MOVED"
 const JOB_ADDED = "JOB_ADDED"
 const JOB_APPLICATION_DATE_SET = "JOB_APPLICATION_DATE_SET"
 const JOB_FIRST_INTERVIEW_DATE_SET = "JOB_FIRST_INTERVIEW_DATE_SET"
 const JOB_SECOND_INTERVIEW_DATE_SET = "JOB_SECOND_INTERVIEW_DATE_SET"
 const JOB_OFFER_DATE_SET = "JOB_OFFER_DATE_SET"

module.exports = { baseURL, JOB_ADDED, JOB_MOVED, JOB_APPLICATION_DATE_SET, JOB_FIRST_INTERVIEW_DATE_SET
                    , JOB_SECOND_INTERVIEW_DATE_SET, JOB_OFFER_DATE_SET}