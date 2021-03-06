const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const validateSignUpBody = require('../services/sign-up-validator');
const validateLogInBody = require('../services/log-in-validator');


/* POST login. */
router.post('/login', validateLogInBody(), function (req, res, next) {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status().json({ errors: errors.array() });
  } else {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      console.log(err);
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: user,
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        console.log(user);
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: 2000,
        });
        return res.json({ user, token });
      });
    })(req, res);
   }
});

router.post('/sign-up', validateSignUpBody(), async function (req, res, next) {
  console.log('auth43', req.body);
  const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        throw errors
        return res.status(400).json({ errors: errors.array() });
      } else {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            throw Error('i am a boy');
            res.status(400).json({ errors: err });
          } else {
            const user = await new User({
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword,
            }).save((err, user) => {
              if (err) {
                return next(err);
              }
              res.json({ message: 'sign up successful', user: user });
              res.status(201);
            });
          }
        });
      };
    } catch (errors) {
      console.log(errors)
      return res.json({ message: errors,status:400 });
    }
  
});

module.exports = router;
