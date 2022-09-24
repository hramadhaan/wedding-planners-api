const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionSchema = new Schema({
  firstPerson: {
    type: String,
    required: true,
    ref: 'authentication'
  },
  secondPerson: {
    type: String,
    required: false,
    ref: 'authentication'
  },
  verified: {
    type: Schema.Types.Boolean,
    required: false,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('connection', connectionSchema)
