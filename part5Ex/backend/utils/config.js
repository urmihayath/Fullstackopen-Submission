require("dotenv").config();

let PORT = process.env.PORT;
console.log(PORT);

let MONGODB_URI = process.env.MONGODB_URI;

module.exports = { PORT, MONGODB_URI };
