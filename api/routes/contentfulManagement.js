const express = require('express')
const router = express.Router()

const UserController = require('../controllers/authorization/user.js')

const HomepageMainController = require('../controllers/homepage/main.js')
const HomepageHeroController = require('../controllers/homepage/hero.js')

/* AUTHORIZATION USER */
router.get('/user', UserController.getUser)

/* HOMEPAGE */
router.get('/homepage/main', HomepageMainController.fetchData)
router.put('/homepage/main', HomepageMainController.updateData)

router.get('/homepage/hero', HomepageHeroController.fetchData)
router.put('/homepage/hero', HomepageHeroController.updateData)

module.exports = router
