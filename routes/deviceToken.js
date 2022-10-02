const express = require('express')
const deviceTokenController = require('../controllers/deviceToken')
const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/save', isAuth, deviceTokenController.saveDeviceToken)

module.exports = router
