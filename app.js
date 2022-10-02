
const express = require('express')
const firebase = require('firebase-admin')
const PORT = process.env.PORT || 8080
const mongoose = require('mongoose')
require('dotenv').config()

// Import routes here
const authRoutes = require('./routes/auth')
const connectionRoutes = require('./routes/connection')
const todoRoutes = require('./routes/todo')
const categoryRoutes = require('./routes/category')
const deviceTokenRoutes = require('./routes/deviceToken')

// Firebase
const firebaseJson = require('./services/firebase/wedding-planner-610ac-firebase-adminsdk-eftyt-f275f240df.json')

// Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(firebaseJson)
  // databaseURL: ''
})

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Initial Route
app.use('/auth', authRoutes)
app.use('/connection', connectionRoutes)
app.use('/todo', todoRoutes)
app.use('/category', categoryRoutes)
app.use('/device-token', deviceTokenRoutes)

app.use((error, req, res, next) => {
  console.log('err: ', error)
  const status = error.statusCode || 500
  const message = error.data?.[0]?.msg || 'Server Failure'
  res.status(status).json({
    success: false,
    message: message
  })
})

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.jnsddhe.mongodb.net/${process.env.CORE_WP}?retryWrites=true&w=majority`
  )
  .then(() => {
    const server = app.listen(PORT)
    const io = require('./services/socket').init(server)
    io.on('connection', (socket) => {
      console.log('Socket io init')
    })
  })
  .catch((err) => {
    console.log('mongoose: ', err)
  })
