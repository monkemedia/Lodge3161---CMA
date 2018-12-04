const express = require('express')
const router = express.Router()

const fetchController = require('../controllers/content/fetch.js')
const updateController = require('../controllers/content/update.js')
const AssetsController = require('../controllers/content/createAssets.js')

router.get('/', fetchController.fetchData)
router.put('/', updateController.updateData)
router.post('/', AssetsController.createAsset)

module.exports = router
