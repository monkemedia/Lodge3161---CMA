const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/authorization/auth.js')

router.post('/', AuthController.getToken)

module.exports = router
