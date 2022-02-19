const config = require("./utils/config");
const express = require("express");
const app = express();

const cors = require("cors");
const personsRouter = require("./controllers/personsRouter");
const usersRouter = require("./controllers/usersRouter");
const loginRouter = require("./controllers/loginRouter");

const middlewares = require("./utils/middlewares");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info("connecting to mongoDB");
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) =>
    logger.error(`Error cinnecting to mongoDB ${error.message}`)
  );

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middlewares.requestLogger);

app.use("/api/persons", personsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;
