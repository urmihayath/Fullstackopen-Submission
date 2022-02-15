const notesRouter = require("express").Router();
const Note = require("../models/mongo");
const User = require("../models/user");

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

notesRouter.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findById(body.userId);

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
