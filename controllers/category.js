// Model
const { validationResult } = require('express-validator')
const isEmpty = require('lodash/isEmpty')
const Category = require('../models/category')

exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const connectionId = req.body.connection_id
    const name = req.body.name
    const description = req.body.description

    const dataCategory = new Category({
      connectionId: connectionId,
      name: name,
      description: description
    })

    const resultData = await dataCategory.save()

    res.status(201).json({
      message: 'Berhasil menambahkan kategori',
      success: true,
      data: resultData
    })
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const categoryId = req.params.id

    const dataCategory = await Category.findById(categoryId)

    if (isEmpty(dataCategory)) {
      res.status(200).json({
        message: 'Kategori tidak ditemukan',
        success: false
      })
    }

    const dataRemove = await Category.findByIdAndRemove(categoryId)

    res.status(200).json({
      message: 'Kategori berhasil dihapus',
      success: true,
      data: dataRemove
    })
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const categoryId = req.body.category_id
    const name = req.body.name
    const description = req.body.description

    const findCategory = await Category.findById(categoryId)

    if (isEmpty(findCategory)) {
      res.status(200).json({
        message: 'Kategori tidak ditemukan',
        success: false
      })
    }

    findCategory.name = name
    findCategory.description = description

    const saveCategory = await findCategory.save()

    res.status(201).json({
      message: 'Kategori berhasil dihapus',
      success: true,
      data: saveCategory
    })
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.fetchCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const connectionId = req.params.id

    const resultCategoryByConnection = await Category.find({ connectionId: connectionId })

    res.status(200).json({
      message: 'Kategori berhasil didapatkan',
      success: true,
      data: resultCategoryByConnection
    })
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
