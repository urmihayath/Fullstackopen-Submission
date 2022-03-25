const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../model/blogs");
const User = require("../model/usersDB");
const logger = require("../utils/logger");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user");
  res.json(blogs);
});

blogsRouter.get("/:id", (req, res) => {
  Blog.findById(req.params.id)
    .then((blog) => (blog ? res.json(blog) : res.status(404).end()))
    .catch((err) => logger.error(err.message));
});

blogsRouter.delete("/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json(204).end();
    })
    .catch((error) => logger.error(error.message));
});

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "Token missing" });
  }

  const user = await User.findById(decodedToken.id);

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();
  res.status(201).json(savedBlog);
});

blogsRouter.put("/:id", (req, res) => {
  const body = req.body;
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true })
    .then((updatedData) => {
      res.json(updatedData);
    })
    .catch((err) => logger.error(err.message));
});

module.exports = blogsRouter;
