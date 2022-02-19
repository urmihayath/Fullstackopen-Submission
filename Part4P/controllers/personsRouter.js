const personsRouter = require("express").Router();
const Person = require("../models/db");
const logger = require("../utils/logger");
const User = require("../models/users");

personsRouter.get("/", async (request, response) => {
  const persons = await Person.find({}).populate("users");
  response.json(persons);

  // Person.find({}).then((persons) => {
  //   logger.info(persons);
  //   response.json(persons);
  // });
});

personsRouter.get("/info", (request, response) => {
  response.json(`Phonebook has info for ${Person.length} people ${new Date()}`);
});

personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error.message);
    });
});

personsRouter.put("/:id", (request, response) => {
  const body = request.body;

  const person = {
    name: body.content,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      logger.error(error.message);
    });
});

personsRouter.post("/", async (request, response) => {
  const body = request.body;

  const existingPerson = 0;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Content Missing",
    });
  }

  // else if (Person.findOne({ name: body.name })) {
  //   return response.status(400).json({
  //     error: "Name must be unique",
  //   });
  // }

  const user = await User.findById(body.userId);

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    userId: user._id,
  });

  const savedPerson = await newPerson.save();
  user.phonebook = user.phonebook.concat(savedPerson._id);
  await user.save();
  response.json(savedPerson);

  // newPerson.save().then((savedPerson) => {
  //   response.json(savedPerson);
  // });
});

module.exports = personsRouter;
