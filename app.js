var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var passportLocal =require('passport-local').Strategy;
var jwtStrategy = require('passport-jwt').Strategy;
var jwtExtractor = require('passport-jwt').ExtractJwt;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var passwordHash = require("password-hash");
var User = require('./models/user');
var app = express();
const connection = mongoose.connect("mongodb://localhost:27017/analytica",{useNewUrlParser: true, useUnifiedTopology: true});
connection.then( db => {
  console.log("Connection Success!");
}, err => console.err(err));
//Setup Local Strategy of Passport
passport.use(new passportLocal({
  usernameField: 'email',
  passwordField: 'password',
  },
  function (email,password,cb) {
    return User.findOne({'email': email})
      .then(user => {
        if (!user) {
          return cb(null,false, {message: 'Incorrect email or password'});
        }
        if (!passwordHash.verify(password,user.password)) {
          return cb(null,false, {message: 'Incorrect email or password'});
        }

        return cb (null,user,{message: 'Login Success!'});
      })
      .catch(err => cb(err));
  } 
));

//Configure JWT Strategy
passport.use(new jwtStrategy(
  {jwtFromRequest:jwtExtractor.fromBodyField("jwt"),secretOrKey:"abc123"},
  function (jwtPayload, cb) {
    return User.findOne({"_id": jwtPayload._id})
      .then (user => cb(null,user))
      .catch (err => cb(err));
  }
  ))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//Some Comment by Aamir Merge Conflict
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
