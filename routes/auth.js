const express = require('express')
const { body } = require('express-validator')
// const multer = require('multer')
// const fs = require('fs')

const Auth = require('../models/auth')

const authControllers = require('../controllers/auth')
// const isAuth = require('../middleware/authentication')

const router = express.Router()

router.post('/register', [
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Passwordnya minimal 5 karakter ya'),
  body('name').trim().not().isEmpty().withMessage('Masukkan Nama kamu ya'),
  body('phone')
    .trim()
    .custom((value) => {
      return Auth.findOne({ phone: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('Wah, nomor Telfon mu sudah pernah didaftarkan') //eslint-disable-line
        }
      })
    }),
  body('username')
    .trim()
    .custom((value) => {
      return Auth.findOne({ username: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('Wah, Username-mu sudah pernah didaftarkan') //eslint-disable-line
        }
      })
    }),
  body('name').trim().not().isEmpty().withMessage('Masukkan Nama kamu ya')
], authControllers.register)

router.post('/login', authControllers.login)

module.exports = router
