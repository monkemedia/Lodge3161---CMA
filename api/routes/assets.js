const express = require('express')
const router = express.Router()
const AssetsController = require('../controllers/assets/assets.js')

router.post('/', AssetsController.createAsset)

module.exports = router