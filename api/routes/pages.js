const express = require('express')
const router = express.Router()

const fetchPagesController = require('../controllers/content/fetchPages.js')

router.get('/', fetchPagesController.fetchData)

module.exports = router
