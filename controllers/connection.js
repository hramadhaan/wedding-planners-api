const Connection = require('../models/connection')
const Auth = require('../models/auth')
const { validationResult } = require('express-validator')
const isEmpty = require('lodash/isEmpty')
const io = require('../services/socket')

exports.requestConnection = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  const requester = req.userId
  const accepter = req.body.accepter

  let saveResultImpl
  let accepterId

  Auth.findById(requester).then((selfUser) => {
    if (!isEmpty(selfUser.connectId)) {
      res.status(200).json({
        message: 'Anda telah memiliki koneksi',
        success: false
      })
    }
    return Auth.findOne({ username: accepter })
  })
    .then((findCouple) => {
      if (isEmpty(findCouple)) {
        res.status(200).json({
          message: 'Pasangan Anda tidak ditemukan',
          success: false
        })
      } else if (!isEmpty(findCouple.connectId)) {
        res.status(200).json({
          message: 'Pasangan yang Anda cari telah mempunyai pasangan yang lain',
          success: false
        })
      }

      const saveConnection = new Connection({
        users: [requester, findCouple._id]
      })
      return saveConnection.save()
    })
    .then((saveResult) => {
      saveResultImpl = saveResult
      return Auth.findById(requester)
    })
    .then(reqUser => {
      reqUser.connectId = saveResultImpl._id
      reqUser.save()
      return Auth.findOne({ username: accepter })
    })
    .then(accUser => {
      accepterId = accUser._id
      accUser.connectId = saveResultImpl._id
      return accUser.save()
    })
    .then(() => {
      const connectionId = saveResultImpl._id
      io.getIO().emit(requester, { type: 'request-connection', data: connectionId })
      io.getIO().emit(accepterId, { type: 'request-connection', data: connectionId })
      res.status(201).json({
        success: true,
        message: 'Sedang menunggu pasangan Anda melakukan konfirmasi',
        data: saveResultImpl
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.acceptConnection = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 400
      error.data = errors.array()
      throw error
    }

    const accepter = req.userId

    const resultAccepter = await Connection.findOne({ users: accepter })

    if (isEmpty(resultAccepter)) {
      res.status(404).json({
        message: 'Akun Anda tidak ditemukan',
        success: false
      })
    } else if (resultAccepter.verified === true) {
      res.status(400).json({
        message: 'Anda telah melakukan konfirmasi',
        success: false
      })
    }

    resultAccepter.verified = true

    const saveConnection = await resultAccepter.save()

    io.getIO().emit(saveConnection._id, { data: 'reload' })

    res.status(200).json({
      message: 'Anda telah melakukan konfirmasi',
      success: true,
      data: saveConnection
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.checkConnection = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const user = req.userId
    const userData = await Auth.findById(user)

    if (isEmpty(userData)) {
      res.status(404).json({
        message: 'Data Anda tidak ditemukan',
        success: false
      })
    }

    console.log('ConnectId: ', userData.connectId)

    if (!userData.connectId) {
      res.status(404).json({
        message: 'Anda belum memiliki pasangan',
        success: false
      })
    }

    const connectData = await Connection.findById(userData.connectId).populate('users')

    res.status(200).json({
      message: 'Berhasil mendapatkan pasangan',
      success: true,
      data: connectData
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
