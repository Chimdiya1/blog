const { body } = require('express-validator');
const User = require('../models/user');

function validateSignUpBody() {
  return [
    // username must be an email
    body('email')
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('E-mail already in use');
          }
        });
      }),
    body('username')
      .not()
      .isEmpty()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Username must not be empty')
      .escape()
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject('Username already in use');
          }
        });
      }),
    // password must be at least 5 chars long
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password is too short')
      .isAlphanumeric(),
    body('confirmPassword')
      .isLength({ min: 5 })
      .isAlphanumeric()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      }),
  ];
}
module.exports = validateSignUpBody;
