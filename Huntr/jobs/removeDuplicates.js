const stringSimilarity = require('string-similarity')

function checkForDuplication(jobName, comparisonName){
  const regExp = new RegExp(' [-\|] .*| |[^a-z0-9]', 'gi') 
  const strippedJobName = jobName.replace(regExp, '')
  const strippedComparisonName = comparisonName.replace(regExp, '')
  const similarity = stringSimilarity.compareTwoStrings(strippedJobName, strippedComparisonName)
  return similarity > 0.7
}

function mergeJobInfo(jobFromHuntr, duplicateJob){
  const countKeys = ['jobCount', 'applicationCount', 'interviewCount', 'offerCount']
  countKeys.forEach(key => jobFromHuntr[key] += duplicateJob[key])
  
  const textKeys = ['domain', 'description', 'location']
  textKeys.forEach(key => {
    if(jobFromHuntr[key] === undefined && duplicateJob[key] !== undefined){
      jobFromHuntr[key] = duplicateJob[key]
    }
  })
} 

function addJobToDuplicates(jobFromHuntr, duplicateJob){
  jobFromHuntr.duplicates.push({
    jobName: jobFromHuntr.name,
    relatedId: duplicateJob.id,
    relatedName: duplicateJob.name
  })
}

function getJobOfferAfterApplyingRate(job){
  const { offerCount, applicationCount } = job
  const percentage = Math.floor(offerCount / applicationCount * 100)
  job.jobOfferAfterApplyingRate = percentage > 100 ? 100 : percentage
}

function removeDuplicateJobs(jobs){ 
  for(let i=0; i<jobs.length; i++){
    const jobFromHuntr = jobs[i]
    jobFromHuntr.name = jobFromHuntr.name.toLowerCase()
    
    // remove jobs without applications
    if(jobFromHuntr.applicationCount === 0){
      jobs.splice(i, 1)
      i--
      continue
    }

    // include the kept job in the duplicates array
    jobFromHuntr.duplicates = []
    addJobToDuplicates(jobFromHuntr, jobFromHuntr)

    for(let j=jobs.length-1; j > i; j--){
      const duplicateJob = jobs[j]
      duplicateJob.name = duplicateJob.name.toLowerCase()

      if(checkForDuplication(jobFromHuntr.name, duplicateJob.name)){
        mergeJobInfo(jobFromHuntr, duplicateJob)   
        addJobToDuplicates(jobFromHuntr, duplicateJob)     
        jobs.splice(j, 1)
      }
    }
    getJobOfferAfterApplyingRate(jobFromHuntr)
  }
  return jobs 
}

module.exports = {
  removeDuplicateJobs
}