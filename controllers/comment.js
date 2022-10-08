const Comment = require('../models/comment')
const { validationResult } = require('express-validator')
const isEmpty = require('lodash/isEmpty')

exports.postComment = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation Failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const userId = req.userId
    const postId = req.body.id
    const comment = req.body.comment

    if (isEmpty(postId) || isEmpty(comment) || isEmpty(userId)) {
      res.status(401).json({
        message: 'Kolom tidak boleh kosong',
        success: false
      })
    }

    const dataPayload = new Comment({ userId: userId, postId: postId, comment: comment })

    const responseData = await dataPayload.save()

    res.status(201).json({
      message: 'Berhasil menambahkan komentar',
      data: responseData,
      success: true
    })
  } catch (err) {
    if (!res.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
