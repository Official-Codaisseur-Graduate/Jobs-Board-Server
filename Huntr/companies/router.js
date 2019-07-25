const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Company = require('./model')
const Duplicate = require('../duplicates/companiesModel')
const { removeDuplicateCompanies } = require('./removeDuplicates')
const { baseURL, token } = require('../constants')

axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.post('/copy-companies', function (req, res, next) {
  axios.get(`${baseURL}/employers?limit=10000`)
    .then(response => {
      const employers = response.data.data
      const noDuplicateEmployers = removeDuplicateCompanies(employers)

      const allCompanies = noDuplicateEmployers.map(employer => {
        const companies = {
          ...employer,
          companyId: employer.id
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

router.get('/allcompanies', (req, res, next) => {
  Company
    .findAll()
    .then(companies => {
      res
        .status(200)
        .send({
          message: "ALL COMPANIES",
          companies: companies
        })
    })
    .catch(error => next(error))
})

module.exports = router