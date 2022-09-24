const Auth = require('../models/auth')
const bcryptjs = require('bcryptjs')
// const includes = require('lodash/includes')
const jwt = require('jsonwebtoken')
// const fs = require('fs')
const { validationResult } = require('express-validator')
require('dotenv').config()

exports.register = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  //   Body Request
  const name = req.body.name
  const username = req.body.username
  const phone = req.body.phone
  const password = req.body.password

  bcryptjs.hash(password, 12)
    .then(hashedPw => {
      const auth = new Auth({
        name,
        username,
        phone,
        password: hashedPw
      })
      return auth.save()
    })
    .then(result => {
      res.status(201).json({
        success: true,
        message: 'Pendaftaran Berhasil',
        data: result
      })
    })
    .catch(err => {
      if (!res.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  // Body Payload
  const user = req.body.user
  const password = req.body.password

  const phoneRegex = /\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/g

  try {
    let auth

    if (phoneRegex.test(user)) {
      auth = await Auth.findOne({ phone: user })
    } else {
      auth = await Auth.findOne({ username: user })
    }

    if (!auth) {
      res.status(403).json({
        success: false,
        message: 'Akun-mu tidak terdaftar'
      })
    }

    const passwordValidator = await bcryptjs.compare(password, auth.password)

    if (!passwordValidator) {
      res.status(403).json({
        success: false,
        message: 'Password yang kamu masukkan salah'
      })
    }

    const token = jwt.sign(
      {
        userId: auth._id.toString()
      },
      process.env.JWT_PASSWORD
    )

    res.status(201).json({
      success: true,
      message: 'Yeay, login kamu berhasil',
      token: token,
      data: auth
    })
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
