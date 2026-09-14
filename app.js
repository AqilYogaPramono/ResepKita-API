const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')

dotenv.config()

const indexRoutes = require('./routes/index')

const authRoutes = require('./routes/auth')

//admin
const adminDashboard = require('./routes/adminRoutes/dashboard')
const adminDetailRecipe = require('./routes/adminRoutes/detailRecipe')
const adminListRecipe = require('./routes/adminRoutes/listRecipe')

//user
const userDashboard = require('./routes/userRoutes/dashboard')
const userProfile = require('./routes/userRoutes/profile')
const userSaveRecipe = require('./routes/userRoutes/saveRecipe')
const userSearch = require('./routes/userRoutes/search')
const userTestimonial = require('./routes/userRoutes/testimonial')
const userRecipe = require('./routes/userRoutes/recipe')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRoutes)
app.use('/API', authRoutes)

//admin
app.use('/API', adminDashboard)
app.use('/API', adminDetailRecipe)
app.use('/API', adminListRecipe)

//user
app.use('/API', userDashboard)
app.use('/API', userProfile)
app.use('/API', userSaveRecipe)
app.use('/API', userSearch)
app.use('/API', userTestimonial)
app.use('/API', userRecipe)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds maximum limit.' })
    }
    return res.status(400).json({ message: err.message })
  }
  if (err && err.message && (err.message.includes('Only image files') || err.message.includes('allowed'))) {
    return res.status(400).json({ message: err.message })
  }

  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
