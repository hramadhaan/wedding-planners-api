const Todo = require('../models/todo')
const Comment = require('../models/comment')
const { validationResult } = require('express-validator')
const isEmpty = require('lodash/isEmpty')
const { sendTargetNotifications } = require('../services/firebase/notifications')

exports.todoSubTotal = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  try {
    const id = req.query.connection_id
    const todoData = await Todo.find({ connectionId: id })
    if (!isEmpty(todoData)) {
      let totalPaid = 0
      let totalPrice = 0
      const todoPaid = todoData.filter((item) => item.status === true)
      todoPaid.forEach((item, index) => {
        totalPaid += item.price
      })
      todoData.forEach((item, index) => {
        totalPrice += item.price
      })

      res.status(200).json({
        success: true,
        message: 'Berhasil menghitung total',
        data: {
          paid: totalPaid,
          total: totalPrice,
          persentace: Math.round(todoPaid.length / todoData.length * 100)
        }
      })
    }
    res.status(404).json({
      message: 'Barang yang akan dibeli tidak ditemukan',
      success: false
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

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

exports.updateTodo = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const id = req.body.id
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const categoryId = req.body.category_id
    const urlLink = req.body.url_link
    const status = req.body.status

    const todoData = await Todo.findById(id)

    if (isEmpty(todoData)) {
      res.status(404).json({
        message: 'Barang yang Anda cari tidak ada',
        success: false
      })
    }

    todoData.title = title
    todoData.description = description
    todoData.price = price
    todoData.categoryId = categoryId
    todoData.urlLink = urlLink
    todoData.status = status

    const saveTodo = await (await todoData.save()).populate('categoryId')

    res.status(201).json({
      message: 'Berhasil melakukan update',
      data: saveTodo,
      success: true
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deleteTodo = async (req, res, next) => {
  try {
    const id = req.params.id

    const checkTodo = await Todo.findById(id)

    if (isEmpty(checkTodo)) {
      res.status(404).json({
        message: 'Tidak dapat menemukan barang',
        success: false
      })
    }
    await Todo.findByIdAndRemove(id)

    // Remove Comment
    const checkCommentTodo = await Comment.find({ postId: id })

    if (!isEmpty(checkCommentTodo)) {
      checkCommentTodo.forEach(async (item) => {
        await Comment.findByIdAndRemove(item.id)
      })
    }

    res.status(200).json({
      message: 'Berhasil menghapus barang',
      success: true
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
