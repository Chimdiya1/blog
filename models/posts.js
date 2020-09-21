const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = require('./user')

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], required: false },
  published: { type: Boolean, default: true },
  timeStamp: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  comments: [
    {
      name: { type: String, required: true },
      content: { type: String, required: true },
      timeStamp: { type: Date, default: Date.now },
    },
  ],
});
module.exports = mongoose.model('post', postSchema);
