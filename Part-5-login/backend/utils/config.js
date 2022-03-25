require("dotenv").config();

const PORT = process.env.PORT;
const DBURL = process.env.DBURL;
const SECRET = process.env.SECRET;

module.exports = {
  PORT,
  DBURL,
  SECRET,
};
