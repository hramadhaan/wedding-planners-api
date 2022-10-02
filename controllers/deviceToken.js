const { isEmpty } = require('lodash')

const Device = require('../models/deviceToken')

exports.saveDeviceToken = async (req, res, next) => {
  try {
    const userId = req.userId
    const token = req.body.token || ''
    const uniqueId = req.body.uniqueId || ''

    const findDevice = await Device.findOne({ userId: userId })

    let saveDevice

    if (isEmpty(findDevice)) {
      // Save new Token
      const saveData = new Device({ token: token, userId: userId, uniqueId: uniqueId })
      saveDevice = await saveData.save()
    } else {
      // Update new token
      findDevice.token = token
      findDevice.uniqueId = uniqueId
      saveDevice = await findDevice.save()
    }

    res.status(201).json({
      success: true,
      message: 'Berhasil menyimpan token Anda',
      data: saveDevice
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
