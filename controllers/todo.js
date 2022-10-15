const Todo = require('../models/todo')
const { validationResult } = require('express-validator')
const isEmpty = require('lodash/isEmpty')
const { sendTargetNotifications } = require('../services/firebase/notifications')

exports.createTodo = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  //   Payload
  try {
    const userId = req.userId
    const connectionId = req.body.id
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const categoryId = req.body.category_id
    const urlLink = req.body.url_link

    const saveTodo = new Todo({ connectionId, title, description, price, categoryId: categoryId, urlLink: urlLink })

    const dataTodo = await saveTodo.save()

    res.status(201).json({
      data: dataTodo,
      message: 'Berhasil menambahkan todo',
      success: true
    })

    sendTargetNotifications(userId, { title: 'Telah mandaftarkan barang', body: title }, { key: 'Create Todo' })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.showTodo = async (req, res, next) => {
  try {
    const connectionId = req.query.connection_id
    const categoryId = req.query.category_id

    let data = {
      connectionId: connectionId
    }

    if (!isEmpty(categoryId)) {
      data = {
        connectionId: connectionId,
        categoryId: categoryId
      }
    }
    const resultTodo = await Todo.find(data).populate('categoryId')

    res.status(200).json({
      data: resultTodo,
      message: 'Berhasil mendapatkan list todo',
      success: true
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
