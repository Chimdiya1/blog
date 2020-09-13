var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var cors = require('cors');
const passport = require('passport');
const JWT = require('jsonwebtoken');


//import routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var authRouter = require('./routes/auth');

//connect to DB
const ConnectDB = require('./config/db');
//environment variables ish
dotenv.config({path:'./config/config.env'})

ConnectDB();
//passport config
require('./config/passport'); 

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
    JWT.verify(
      req.headers.authorization.slice(7),
      process.env.JWT_SECRET,
      function (err, decodedToken) {
        if (err) {
        /* handle token err */
          req.user = null;
        } else {
          req.user = decodedToken._id; // Add to req object
          
        }
      }
    );
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/blog', blogRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
