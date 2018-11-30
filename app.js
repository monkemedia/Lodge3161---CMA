const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const findRemoveSync = require('find-remove')

const userRoutes = require('./api/routes/user.js')
const assetsRoutes = require('./api/routes/assets.js')
const homepageRoutes = require('./api/routes/homepage.js')
const authRoutes = require('./api/routes/auth.js')

const cors = require('cors')

// REMOVES IMAGES FROM PUBLIC FOLDER WHEN THEY ARE OVER 1 HOUR OLD
const result = findRemoveSync('./public/uploads', {
  age: {
    seconds: 3600
  },
  files: '*.*'
})

result

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({
  limit: '50mb', extended: true
}))
app.use(cors())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

// Routes which should handle requests
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/assets', assetsRoutes)
app.use('/api/v1/homepage', homepageRoutes)
app.use('/api/v1/auth', authRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
