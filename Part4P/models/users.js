const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  phonebook: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
  ],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);