const notesRouter = require("express").Router();
const Note = require("../models/mongo");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

notesRouter.get("/", async (request, response) => {
  const allNotes = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(allNotes.map((note) => note.toJSON()));
  // Note.find({}).then((notes) => {
  //   response.json(notes);
  // });
});

notesRouter.get("/:id", async (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      response.json(note);
    })
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.json(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
};

notesRouter.post("/", async (request, response) => {
  const body = request.body;

  const token = getTokenFrom(request);
  console.log(token);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    userId: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.json(savedNote);

  // note.save().then((savedNote) => {
  //   response.json(savedNote);
  // });
});

notesRouter.put("/:id", (request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = notesRouter;
