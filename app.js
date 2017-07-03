const express        = require('express');
const path           = require('path');
const favicon        = require('serve-favicon');
const logger         = require('morgan');
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const layouts        = require('express-ejs-layouts');
const mongoose       = require('mongoose');
const session        = require('express-session');
const passport       = require('passport');
//load vars from the .env file. must be at the top
require('dotenv').config();
require('./config/passport-config.js');

mongoose.connect(process.env.MONGODB_URI);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express, Passport, Mongoose etc.';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(session({
  secret: '^dsfj^&sgdfgdsg9*%$fh[]', //has to be different for every app.js file no matter what's the value of it
  resave: true,
  saveUninitialized: true
}));
// next 2 lines have to immediately follow app.use(session)
app.use(passport.initialize());
app.use(passport.session());
// --------------------------------------------------------
//check if the user is logged in
//this middleware creates 'currentUser' for ALL views
app.use((req, res, next) => {
  if (req.user) {
    // Create the 'currentUser' local variable for all views
    res.locals.currentUser = req.user;
  }
  //if we don't put next() pagee will load forever
  next();
});
const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth-routes');
app.use('/', auth);

const rooms = require('./routes/room-routes');
app.use('/', rooms);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
