const express = require('express')
const router = express.Router()
const UserController = require('../controllers/authorization/user.js')

router.get('/', UserController.getUser)

module.exports = router
