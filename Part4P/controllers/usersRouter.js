const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/users");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  const exisitingUser = await User.findOne({ username });

  if (exisitingUser) {
    return response.status(400).json({
      error: "Username must be unique",
    });
  }
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username: username,
    name: name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const addedUsers = await User.find({}).populate("phonebook");
  response.json(addedUsers);
});

usersRouter.delete("/:id", async (request, response) => {
  const delUser = await User.findByIdAndRemove(request.params.id);

  response.status(204).end();
});

module.exports = usersRouter;
