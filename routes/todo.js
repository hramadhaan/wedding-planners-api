const express = require('express')
const todoControllers = require('../controllers/todo')
const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/create', isAuth, todoControllers.createTodo)
router.get('/list', todoControllers.showTodo)
router.get('/total', todoControllers.todoSubTotal)
router.post('/update', todoControllers.updateTodo)
router.get('/delete/:id', todoControllers.deleteTodo)

module.exports = router
