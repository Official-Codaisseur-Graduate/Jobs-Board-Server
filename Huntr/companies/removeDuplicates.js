const stringSimilarity = require('string-similarity')

function checkForDuplication(companyName, comparisonName){
  const regExp = new RegExp(' [-\|] .*| |[^a-z0-9]', 'gi') 
  const strippedCompanyName = companyName.replace(regExp, '')
  const strippedComparisonName = comparisonName.replace(regExp, '')
  const similarity = stringSimilarity.compareTwoStrings(strippedCompanyName, strippedComparisonName)
  return similarity > 0.7
}

function mergeCompanyInfo(companyFromHuntr, duplicateCompany){
  const countKeys = ['jobCount', 'applicationCount', 'interviewCount', 'offerCount']
  countKeys.forEach(key => companyFromHuntr[key] += duplicateCompany[key])
  
  const textKeys = ['domain', 'description', 'location']
  textKeys.forEach(key => {
    if(companyFromHuntr[key] === undefined && duplicateCompany[key] !== undefined){
      companyFromHuntr[key] = duplicateCompany[key]
    }
  })
} 

function addCompanyToDuplicates(companyFromHuntr, duplicateCompany){
  companyFromHuntr.duplicates.push({
    companyName: companyFromHuntr.name,
    relatedId: duplicateCompany.id,
    relatedName: duplicateCompany.name
  })
}

function getJobOfferAfterApplyingRate(company){
  const { offerCount, applicationCount } = company
  const percentage = Math.floor(offerCount / applicationCount * 100)
  company.jobOfferAfterApplyingRate = percentage > 100 ? 100 : percentage
}

function removeDuplicateCompanies(companies){ 
  for(let i=0; i<companies.length; i++){
    const companyFromHuntr = companies[i]
    companyFromHuntr.name = companyFromHuntr.name.toLowerCase()
    
    // remove companies without applications
    if(companyFromHuntr.applicationCount === 0){
      companies.splice(i, 1)
      i--
      continue
    }

    // include the kept company in the duplicates array
    companyFromHuntr.duplicates = []
    addCompanyToDuplicates(companyFromHuntr, companyFromHuntr)

    for(let j=companies.length-1; j > i; j--){
      const duplicateCompany = companies[j]
      duplicateCompany.name = duplicateCompany.name.toLowerCase()

      if(checkForDuplication(companyFromHuntr.name, duplicateCompany.name)){
        mergeCompanyInfo(companyFromHuntr, duplicateCompany)   
        addCompanyToDuplicates(companyFromHuntr, duplicateCompany)     
        companies.splice(j, 1)
      }
    }
    getJobOfferAfterApplyingRate(companyFromHuntr)
  }
  return companies 
}

module.exports = {
  removeDuplicateCompanies
}