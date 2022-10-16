const Auth = require('../models/auth')
const Connection = require('../models/connection')

let io

const sendDataComment = async (userId, todoId, result) => {
  try {
    //
    const userRequest = await Auth.findById(userId)
    const connectionId = userRequest.connectId

    const connectData = await Connection.findById(connectionId)

    const recipientId = connectData.users.find((item) => item.toString() !== userId)

    this.getIO().emit(`${recipientId}:${todoId}`, { data: result })
  } catch (err) {
    console.log('Err: ', err)
  }
}

module.exports = {
  init: (httpServor) => {
    io = require('socket.io')(httpServor)
    return io
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not intiialized')
    }
    return io
  },
  sendDataComment
}
