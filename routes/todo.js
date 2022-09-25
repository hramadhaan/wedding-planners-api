const express = require('express')
// const { body } = require('express-validator')
// const Connection = require('../models/connection')
const multer = require('multer')
const fs = require('fs')
const todoControllers = require('../controllers/todo')

const router = express.Router()

// Storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'images/profile/')
    const path = 'images/todo'
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + ' - ' + file.originalname)
  }
})

router.post('/create', multer({ storage: fileStorage }).array('photos', 4), todoControllers.createTodo)
router.get('/list', todoControllers.showTodo)

module.exports = router
