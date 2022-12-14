const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  connectionId: {
    type: Schema.Types.ObjectId,
    ref: 'connection',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Schema.Types.Number,
    default: 0
  },
  status: {
    type: Schema.Types.Boolean,
    default: false
  },
  urlLink: {
    type: Schema.Types.String,
    required: false
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('todo', todoSchema)
