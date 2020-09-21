const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Comment = require('../models/comment');
const Blog = require('../models/posts');

// @desc        post a comment
// @route       POST /comment
router.post('/', async function (req, res, next) {
  //create single blog post
  try {
      var comment = { name: req.body.name, content: req.body.content };
      let blog = await Blog.findOneAndUpdate(
        { _id: req.body.id },
        { $push: { comments: comment } }
      );
   
    res.status(201);
    res.json({ message: 'comment added',blog });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
