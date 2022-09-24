const express = require('express')
// const { body } = require('express-validator')
// const Connection = require('../models/connection')
const connectionControllers = require('../controllers/connection')
// Middleware
const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/request', isAuth, connectionControllers.requestConnection)

router.get('/accept', isAuth, connectionControllers.acceptConnection)

router.get('/check', isAuth, connectionControllers.checkConnection)

module.exports = router
