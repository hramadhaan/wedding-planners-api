const express = require('express')
const categoryControllers = require('../controllers/category')
const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/create', isAuth, categoryControllers.createCategory)
router.get('/delete/:id', isAuth, categoryControllers.deleteCategory)
router.post('/update', isAuth, categoryControllers.updateCategory)
router.get('/list/:id', isAuth, categoryControllers.fetchCategory)

module.exports = router
