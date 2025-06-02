var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var dotenv = require('dotenv')
const cors = require('cors')
const { onlyDomain } = require('./middlewares/corsOption')

dotenv.config()

var indexRouter = require('./routes/index')
var authRoutes = require('./routes/auth')

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

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors(onlyDomain))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
