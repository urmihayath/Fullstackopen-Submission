require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
app.use(express.json());
const userRouter = require("./controllers/userRouter");

const loginRouter = require("./controllers/loginRouter");

app.use(cors());
app.use(express.json());
const blogsRouter = require("./controllers/blogsRouter");

app.use("/api/blogs", blogsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
