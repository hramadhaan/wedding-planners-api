const express = require('express')
const todoControllers = require('../controllers/todo')
const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/create', isAuth, todoControllers.createTodo)
router.get('/list', todoControllers.showTodo)

module.exports = router
