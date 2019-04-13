const express = require('express')
const router = express.Router()

const createController = require('../controllers/blog/create.js')
const fetchController = require('../controllers/blog/fetch.js')
const fetchPostsController = require('../controllers/blog/fetchPosts.js')
const updateController = require('../controllers/blog/update.js')
const assetsController = require('../controllers/blog/createAsset.js')
const deleteController = require('../controllers/blog/deletePost.js')

router.post('/create', createController.createData)
router.get('/fetch', fetchController.fetchData)
router.get('/posts', fetchPostsController.fetchData)
router.put('/update', updateController.updateData)
router.post('/create/asset', assetsController.createAsset)
router.delete('/delete', deleteController.deletePost)

module.exports = router
