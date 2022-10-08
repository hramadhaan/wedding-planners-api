const Auth = require('../../models/auth')
const firebase = require('firebase-admin')
const Device = require('../../models/deviceToken')
const Connection = require('../../models/connection')

exports.sendTargetNotifications = async (user = '', message = { title: '', body: '' }, data = {}) => {
  try {
    const userRequest = await Auth.findById(user)
    const connectionId = userRequest.connectId

    const connectData = await Connection.findById(connectionId)

    const recipient = connectData.users.find((item) => item.toString() !== user)

    const recipientData = await Device.findOne({ userId: recipient })

    const recipientToken = recipientData.token

    const payload = {
      token: recipientToken,
      notification: {
        title: message.title,
        body: message.body
      },
      data: data
    }

    await firebase.messaging().send(payload)
  } catch (err) {
    const error = new Error('Error when send notifications')
    error.statusCode = 422
    error.data = err
    throw error
  }
}
