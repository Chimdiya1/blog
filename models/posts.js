const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], required: false },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, default: true },
  timeStamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('post', postSchema);
