const blogsRouter = require("express").Router();
const Blog = require("../models/blogsDB");

blogsRouter.get("/", async (request, response) => {
  const allBlogs = await Blog.find({});
  response.json(allBlogs.map((blog) => blog.toJSON()));
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
