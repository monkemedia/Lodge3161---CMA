const express = require('express')
const router = express.Router()

const HomepageController = require('../controllers/homepage.js')
const UserController = require('../controllers/user.js')

router.get('/homepage', HomepageController.getHomepage)
router.put('/homepage', HomepageController.updateHomepage)
router.get('/user', UserController.getUser)

module.exports = router
