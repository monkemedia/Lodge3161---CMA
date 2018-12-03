const express = require('express')
const router = express.Router()

const fetchBasicController = require('../controllers/fetch/basic.js')
const fetchMediaController = require('../controllers/fetch/media.js')
const fetchButtonController = require('../controllers/fetch/button.js')

router.get('/basic', fetchBasicController.fetchData)
router.get('/media', fetchMediaController.fetchData)
router.get('/button', fetchButtonController.fetchData)

module.exports = router
