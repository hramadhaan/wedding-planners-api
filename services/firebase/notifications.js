const firebase = require('firebase-admin')
const Auth = require('../../models/auth')
const Connection = require('../../models/connection')

export const sendNotifications = async (user = '', message = { title: '', body: '' }) => {
  try {
    const userRequest = await Auth.findById(user)
    const connectionId = userRequest.connectId

    const connectData = await Connection.findById(connectionId)

    const recipient = connectData.users.filter((user) => user !== userRequest)

    const payload = {
      token: recipient,
      notifications: {
        title: message.title,
        body: message.body
      }
    }
    await firebase.messaging().send(payload)
  } catch (err) {
    console.log('Err notifications: ', err)
    const error = new Error('Error when send notifications')
    error.statusCode = 422
    error.data = err
    throw error
  }
}
