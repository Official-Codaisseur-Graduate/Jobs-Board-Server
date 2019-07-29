const { Router } = require('express')
const router = new Router()
const axios = require('axios')
const Sequelize = require('sequelize')
const { baseURL } = require('../constants')

const Entry = require('./model');

const token = process.env.API_TOKEN
axios.defaults.baseURL = baseURL
axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

router.get('/entries', (req, res, next) => {
    Entry
        .findAll()
        .then(entries => {
            res
                .status(200)
                .send({
                    message: "ALL ENTRIES",
                    entries: entries
                })
        })
        .catch(error => next(error))
})

module.exports = router