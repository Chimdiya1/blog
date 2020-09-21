var express = require('express');
var router = express.Router();
const Blog = require('../models/posts');
const passport = require('passport');

// @desc        get all published blogposts
// @route       GET /blog

router.get('/', async function (req, res, next) {
  try {
    const blogs = await Blog.find().populate('author').lean()
    res.json(blogs)
    console.log(blogs);
  } catch (error) {
    res.status(404);
    res.json({ message: 'An error has occured, go figure :)' });
  }
});

// @desc        get all  blogposts
// @route       GET /blog/all

router.get('/all', async function (req, res, next) {
  try {
    const blogs = await Blog.find().populate('author').lean();
    res.json(blogs);
    console.log(req.user);
  } catch (error) {
    res.status(404);
    res.json({ message: 'An error has occured, go figure :)' });
  }
});

// @desc        get all  blogposts by a user
// @route       GET /blog/all/:id

router.get('/all/:id', async function (req, res, next) {
  try {
    const blogs = await Blog.find({ author: req.params.id })
      .populate('author')
      .lean();
    res.json(blogs);
    console.log(req.user);
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
    const blog = await Blog.findOne({ _id: req.params.id })
      .populate('author')
      .populate('comments')
      .lean();
    console.log('eeeeeee:',blog.comments)
    if (!blog) {
      res.status(401);
      return res.json({ message: 'that blog post does not exist, jazz up' });
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
      console.log(req.user);
      req.body.author = req.user.id;
      const blog = await Blog.create(req.body);
      res.status(201);
      res.json({ message: 'Blog post created', blog });
    } catch (error) {
      res.status(404).json({ message: 'An error has occured, go figure :)' });
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
    const blog = await Blog.findOne({ _id: req.params.id });
    console.log(blog.author, '  ', req.user.id);
    if (blog.author.toString() === req.user.id.toString()) {
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
    } else {
      res
        .status(401)
        .json({ message: 'Unauthorized, no be you get this blog na' });
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
    const blog = await Blog.findOne({ _id: req.params.id });
    console.log(blog.author, '  ', req.user.id);
    if (blog.author.toString() === req.user.id.toString()) {
      try {
        await Blog.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'blog post deleted successfully' });
      } catch (error) {
        console.log(error);
        res.send(500);
      }
    } else {
      res
        .status(401)
        .json({ message: 'Unauthorized, no be you get this blog na' });
    }
  }
);

module.exports = router;
