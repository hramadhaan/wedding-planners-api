const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  postId: {
    required: true,
    ref: 'todo',
    type: Schema.Types.ObjectId
  },
  userId: {
    required: true,
    ref: 'authentication',
    type: Schema.Types.ObjectId
  },
  comment: {
    required: true,
    type: Schema.Types.String
  }
}, { timestamps: true })

module.exports = mongoose.model('comment', commentSchema)
