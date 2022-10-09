const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')

  if (!authHeader) {
    res.status(400).json({
      success: false,
      message: 'Token Anda tidak valid'
    })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(authHeader, process.env.JWT_PASSWORD)
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Kesalahan pada verifikasi token',
      error: err
    })
  }

  if (!decodedToken) {
    res.status(401).json({
      message: 'Harap login terlebih dahulu',
      success: false
    })
  }

  req.userId = decodedToken.userId

  next()
}
