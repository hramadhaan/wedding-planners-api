const mongoose = require('mongoose')
const Schema = mongoose.Schema

const authenticationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false,
      default: ''
    },
    connectId: {
      type: String,
      required: false,
      ref: 'connection',
      default: ''
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('authentication', authenticationSchema)
