const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  title: { type: String, required: true },
  word: { type: String, required: true },
  wordClass: { type: String, required: true },
  meaningNumber: { type: String, required: true },
  definition: { type: String, required: true },
});

module.exports = mongoose.model("Data", dataSchema);
