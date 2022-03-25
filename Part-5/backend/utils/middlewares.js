const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info(`Method: ${req.method}`);
  logger.info(`Path: ${req.path}`);
  logger.info(`Body: ${req.body}`);
  logger.info(`-----`);
};

const unknownEndpoint = (req, res) => {
  res.status(204).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  if ((err.name = "CastError")) {
    return res.status(400).send({ err: "malformatted id" });
  } else if ((err.name = "Validation Error")) {
    return res.status(400).send({ err: err.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
