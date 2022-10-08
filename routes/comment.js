const express = require('express')
const commentControllers = require('../controllers/comment')
const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/post', isAuth, commentControllers.postComment)

module.exports = router
