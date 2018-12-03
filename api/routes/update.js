const express = require('express')
const router = express.Router()

const updateBasicController = require('../controllers/update/basic.js')
// const updateMediaController = require('../controllers/update/media.js')
// const updateButtonController = require('../controllers/update/button.js')

router.put('/basic', updateBasicController.updateData)
// router.put('/media', updateMediaController.updateData)
// router.put('/button', updateButtonController.updateData)

module.exports = router
