const { body } = require('express-validator');

function validateLogInBody() {
  return [
    body('email')
      .not()
      .isEmpty()
      .isEmail()
      .trim()
      .withMessage('Username must not be empty')
      .escape(),
    body('password')
      .not()
      .isEmpty()
      .trim()
      .withMessage('Password field is empty')
      .escape(),
  ];
}
module.exports = validateLogInBody;
