const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const commentsSchema = new Schema({
  postId: Number,
  id: Number,
  name: String,
  email: String,
  body: String,
});

module.exports = commentsSchema;
