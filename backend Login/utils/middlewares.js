const { response } = require("express");
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info(`Method : ${request.method}`);
  logger.info(`Path : ${request.path}`);
  logger.info(`Body : ${request.body}`);

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = (error, request, reponse, next) => {
  logger.info(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
