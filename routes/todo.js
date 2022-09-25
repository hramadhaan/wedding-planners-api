const express = require('express')
const todoControllers = require('../controllers/todo')

const router = express.Router()

router.post('/create', todoControllers.createTodo)
router.get('/list', todoControllers.showTodo)

module.exports = router
