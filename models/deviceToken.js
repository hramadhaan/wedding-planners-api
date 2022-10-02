const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deviceTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'authentication'
  },
  token: {
    type: String,
    required: false,
    default: ''
  },
  uniqueId: {
    type: String,
    required: false,
    default: ''
  }
}, { timestamps: true })

module.exports = mongoose.model('device', deviceTokenSchema)
