const express = require('express')
const router = express.Router()

const createController = require('../controllers/blog/create.js')
const fetchController = require('../controllers/blog/fetch.js')
const updateController = require('../controllers/blog/update.js')

router.post('/', createController.createData)
router.get('/', fetchController.fetchData)
router.put('/', updateController.updateData)

module.exports = router
