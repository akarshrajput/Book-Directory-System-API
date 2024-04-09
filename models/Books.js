const mongoose = require("mongoose");
const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cover_image: {
    type: String,
    required: true,
  },
  // cover_image_url: {
  //     type: String,
  //     required: true
  // },
  author: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Date,
    default: Date.now,
  },
});

const Book = (module.exports = mongoose.model("Book", BookSchema));
