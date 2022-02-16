const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info(`Method :  ${request.method}`);
  logger.info(`Path :  ${request.path}`);
  logger.info(`Info :  ${request.info}`);
  logger.info("------");
  next();
};

const unknownEndpoint = (request, response) => {
  request.status(404).send({ error: "Unknown Endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "Malformatted ID" });
  } else if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
