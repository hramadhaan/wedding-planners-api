let io

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
  }
}
