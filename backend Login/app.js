const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");

const notesRouter = require("./controllers/notesRouter");
const usersRouter = require("./controllers/usersRouter");
const loginRouter = require("./controllers/loginRouter");

const middleware = require("./utils/middlewares");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
logger.info(`Connecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to mongoDB");
  })
  .catch((error) => {
    logger.error(`error connecting to ${error.message}`);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
