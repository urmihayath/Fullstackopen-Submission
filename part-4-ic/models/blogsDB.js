const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (document, returnedBoject) => {
    returnedBoject.id = returnedBoject._id.toString();
    delete returnedBoject._id;
    delete returnedBoject.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
