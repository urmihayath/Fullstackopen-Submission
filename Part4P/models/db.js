const mongoose = require("mongoose");
const config = require("../utils/config");

const url = config.MONGODB_URI;
console.log(`Connecting to ${url}`);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: Number,
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
