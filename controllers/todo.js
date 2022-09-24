const Todo = require('../models/todo')
const { validationResult } = require('express-validator')
const { isEmpty } = require('lodash')

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
    const connectionId = req.body.id
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const photos = req.files

    const photoPaths = []

    if (!isEmpty(photos)) {
      photos.forEach((item) => {
        photoPaths.push(item.path)
      })
    }

    const saveTodo = new Todo({ connectionId, title, description, price, photos: photoPaths })

    const dataTodo = await saveTodo.save()

    res.status(201).json({
      data: dataTodo,
      message: 'Berhasil menambahkan todo',
      success: true
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.showTodo = async (req, res, next) => {
  try {
    const connectionId = req.params.id
    const resultTodo = await Todo.find({ connectionId: connectionId })

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
