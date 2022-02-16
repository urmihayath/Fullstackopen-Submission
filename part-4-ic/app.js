const config = require("./utils/config");

const express = require("express");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogsRouter");
const userRouter = require("./controllers/userRouter");
const middleware = require("./utils/middlewares");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

logger.info(`Connecting to MongoDB`);

mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    logger.info(`connected to MongoDB`);
  })
  .catch((error) => {
    logger.error(error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
