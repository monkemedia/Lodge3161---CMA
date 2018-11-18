const express = require('express');
const router = express.Router();

const HomepageController = require('../controllers/homepage.js');

router.get('/homepage', HomepageController.getHomepage);
router.put('/homepage', HomepageController.updateHomepage);

module.exports = router;
