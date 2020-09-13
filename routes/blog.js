var express = require('express');
var router = express.Router();
const Blog = require('../models/posts');
const passport = require('passport');

// @desc        get all blogposts
// @route       GET /blog

router.get('/', async function (req, res, next) {
  try {
    const blogs = await Blog.find().lean();
    res.json(blogs);
    console.log(req.user)
  } catch (error) {
    res.status(404);
    res.json({ message: 'An error has occured, go figure :)' });
  }
});

// @desc        get specific blogpost
// @route       GET /blog/:id

router.get('/:id', async function (req, res, next) {
  //return single blog post
  try {
      const blog = await Blog.findOne({ _id: req.params.id }).lean();
      if (!blog) {
           res.status(401)
          return res.json({message:'that blog post does not exist, jazz up'});
      } else {
          res.status(200);
          res.json(blog);
    }
    
  } catch (error) {
    res.status(404);
    res.json({ message: 'An error has occured, go figure :)' });
  }
});

// @desc        create specific blogpost
// @route       POST /blog/create

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    //create single blog post
    try {
      console.log(req.user)
      const blog = await Blog.create(req.body);
      res.status(201);
      res.json({ message: 'Blog post created', blog });
    } catch (error) {
      res.status(404);
      res.json({ message: 'An error has occured, go figure :)' });
    }
  }
);

// @desc        edit specific blogpost
// @route       PUT /blog/:id

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    //edit single blog post
    try {
      let blog = await Blog.findById(req.params.id).lean();

      if (!blog) {
        return res.json({ message: 'jazz up' });
      } else {
        blog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200);
        res.json({ message: 'Blog post updated', blog });
      }
    } catch (error) {
      console.log(error);
      res.render('error/500');
    }
  }
);

// @desc        delete specific blogpost
// @route       DELETE /blog/:id

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async function (req, res, next) {
    //delete single blog post
    try {
      await Blog.remove({ _id: req.params.id });
      res.status(200);
      res.json({ message: 'blog post deleted successfully' });
    } catch (error) {
      console.log(error);
      res.send(500);
    }
  }
);

module.exports = router;
