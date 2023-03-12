const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true },
  content: { type: Array },
  // creator: { type: String, required: true, ref: "User" },
});

module.exports = mongoose.model("Course", courseSchema);
