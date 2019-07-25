const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Company = require('./model')
const Duplicate = require('../duplicates/model')
const { removeDuplicateCompanies } = require('./removeDuplicates')

// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6IjJlZDFkNmIyLWU3YjItNDE2ZS04NzVlLWJiNDhkNzBkM2RhNCIsImlhdCI6MTU1NDgyNTEzMX0.hOfXhHcElNhCOMtM_TTwHr6tf6VhFmL0uzUEuT9hNjk"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTgyMmRjYWM2MjIxMDAwZWM3NjQ3ZSIsImp0aSI6ImQ1NWNkMzgyLTYyYWItNGQzOC04NmE5LThmMDUzNjU0NmZiOSIsImlhdCI6MTU2Mzk5NTQ0MH0.Tsp_8VXXrihtqIkMPdID6nui8JEE2rG_4CysRR4B93A"
axios.defaults.baseURL = 'https://api.huntr.co/org'
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-companies', function (req, res, next) {
  axios.get(`https://api.huntr.co/org/employers?limit=10000`)
    .then(response => {
      const employers = response.data.data
      const noDuplicateEmployers = removeDuplicateCompanies(employers)

      const allCompanies = noDuplicateEmployers.map(employer => {
        const companies = {
          ...employer,
          companyId: employer.id,
        }
        const relations = { include: [{ model: Duplicate }] }

        return Company.create(companies, relations)
      })
      return Promise.all(allCompanies)
    })
    .then(companies => {
      res.send({ length: companies.length }).end()
    })
    .catch(error => next(error))
})

router.get('/companies', function (req, res, next) {
  const page = req.query.page
  const sortProperty = req.query.sortBy
  const limit = 12
  const applicationCount = req.query.applicationCount
  const offerCount = req.query.offerCount
  const offset = page * limit
  const searchName =  req.query.search ? 
                        {name: { [Op.like]: `%${req.query.search}%` }}
                        : 
                        undefined
  Company
    .findAndCountAll({
      limit, offset,
      order: [[sortProperty,'DESC']],
      where:  searchName ? 
                searchName 
                : 
                sortProperty==="jobOfferAfterApplyingRate" ?
                  {applicationCount: {[Op.gte]:applicationCount ?
                                                applicationCount:0
                  }}
                  :
                  {offerCount: {[Op.gte]: offerCount?
                                            offerCount:0
                  }} 
    })
    .then(companies => {
        const { count } = companies
        const pages = Math.ceil(count / limit)
        res.send({ rows: companies.rows, pages }).end()
    })
    .catch(error => next(error))
})

router.get('/companies/:id', function (req, res, next) {
  const { id } = req.params
  Company
    .findByPk(id)
    .then(company => res.send(company).end())
    .catch(error => next(error))
})

// router.get('/companies/indeed/:name', function (req, res, next) {
//   const { name } = req.params
//   const searchName = {
//     name: { [Op.like]: `${name.toLowerCase()}%` }
//   }
//   Company
//     .findOne({
//       where: searchName
//     })
//     .then(companies => {
//       res.send(companies)
//         .end()
//     })
//     .catch(error => next(error))
// })

module.exports = router