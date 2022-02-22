const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/users");

userRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body.username || !body.password) {
    return response.status(401).json({
      error: "The username and password are required",
    });
  } else if (body.username.length < 4 || body.password.length < 4) {
    return response.status(401).json({
      error: "The length of the username and password must be more than 4",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.json(savedUser);
});

userRouter.get("/", async (request, response) => {
  const allUsers = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    likes: 1,
  });
  response.json(allUsers);
});

userRouter.delete("/:id", async (request, response) => {
  const result = await User.findByIdAndRemove(request.params.id);
  response.json(204).end();
});

module.exports = userRouter;
