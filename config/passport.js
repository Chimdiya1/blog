const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, cb) {
      return User.findOne({ email:email })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' });
          }
          //compare password
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              return cb(null, user, { message: 'Logged In Successfully' });
            } else {
              // passwords do not match!
              return cb(null, false, { message: 'Passwords do not match' });
            }
          });
        })
        .catch((err) => cb(err));
    }
  )
);
 passport.serializeUser(function (user, done) {
   done(null, user.id);
 });

 passport.deserializeUser(function (id, done) {
   User.findById(id, function (err, user) {
     done(err, user);
   });
 });

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, cb) {
      
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return User.findById(jwtPayload._id)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          console.log(jwtPayload);
          return cb(err);
        });
    }
  )
);
