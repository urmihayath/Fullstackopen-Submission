const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../model/usersDB");

userRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await newUser.save();
  res.status(201).json(savedUser);
});

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs");
  res.json(users);
});

userRouter.delete("/:id", async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = userRouter;
