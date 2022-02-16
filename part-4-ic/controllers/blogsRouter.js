const blogsRouter = require("express").Router();
const Blog = require("../models/blogsDB");
const User = require("../models/users");

blogsRouter.get("/", async (request, response) => {
  const allBlogs = await Blog.find({}).populate("user", { username: 1 });
  response.json(allBlogs.map((blog) => blog.toJSON()));
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = await User.findById(body.userId);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const result = await Blog.findByIdAndRemove(request.params.id);

  response.status(201).json(result);
});

module.exports = blogsRouter;
