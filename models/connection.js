const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      default: true,
      ref: 'authentication'
    }
  ],
  verified: {
    type: Schema.Types.Boolean,
    required: false,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('connection', connectionSchema)
