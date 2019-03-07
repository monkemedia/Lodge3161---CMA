const express = require('express')
const router = express.Router()

const fetchController = require('../controllers/content/fetch.js')
const fetchEntriesController = require('../controllers/content/fetchEntries.js')
const updateController = require('../controllers/content/update.js')
const createController = require('../controllers/content/create.js')
const assetsController = require('../controllers/content/createAssets.js')
const deleteController = require('../controllers/content/deletePage.js')

router.get('/', fetchController.fetchData)
router.get('/entries', fetchEntriesController.fetchData)

router.put('/', updateController.updateData)

router.post('/', createController.createData)
router.post('/asset', assetsController.createAsset)

router.delete('/', deleteController.deletePage)

module.exports = router
