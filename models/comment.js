const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('comment', commentSchema);
