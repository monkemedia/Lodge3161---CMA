const express = require('express')
const router = express.Router()
const HomepageMainController = require('../controllers/homepage/main.js')
const HomepageHeroBasicController = require('../controllers/homepage/hero/basic.js')
const HomepageHeroMediaController = require('../controllers/homepage/hero/media.js')
const HomepageHeroButtonController = require('../controllers/homepage/hero/button.js')
const HomepageCBTBasicController = require('../controllers/homepage/contentBlockTop/basic.js')

router.get('/main', HomepageMainController.fetchData)
router.put('/main', HomepageMainController.updateData)

router.get('/hero/basic', HomepageHeroBasicController.fetchData)
router.put('/hero/basic', HomepageHeroBasicController.updateData)
router.get('/hero/media', HomepageHeroMediaController.fetchData)
router.get('/hero/button', HomepageHeroButtonController.fetchData)
router.put('/hero/button', HomepageHeroButtonController.updateData)

module.exports = router
