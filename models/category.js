const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  connectionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'connection'
  }
}, { timestamps: true })

module.exports = mongoose.model('category', categorySchema)
