var express = require('express');
var router = express.Router();

// @desc        get all blogposts
// @route       GET /stories

router.get('/', function (req, res, next) {
  res.json({user: req.user})
});

module.exports = router;
