const { Router } = require('express')
const indeed = require('indeed-scraper');
const router = new Router()

const queryOption = {
  host: 'www.indeed.nl',
  radius: '25',
  level: 'entry_level',
  jobType: 'fulltime',
  maxAge: '14',
  sort: 'relevance',
  limit: '12'
}

function deDuplicate(jobs){
  const names = jobs.map(item => item.company)
  return jobs.filter((item, index) => {
    const name = item.company
    return names.indexOf(name) >= index
  })
}

router.get('/jobs', function (req, res, next) {
  const { query, city } = req.query
  queryOption.query = query
  queryOption.city = city

  indeed
    .query(queryOption)
    .then(jobs => {
      res.json( deDuplicate(jobs) ).end()
    })
    .catch(error => next(error))
})

module.exports = router