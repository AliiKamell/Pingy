const mongoose = require("mongoose");
const room = new mongoose.Schema({
  name: {
    type: String,
  },
  participants: [String],
  messages: [
    {
      message: { type: String },

      sender: { type: String },

      dateCreated: { type: String },
    },
  ],
});
const Room = mongoose.model("Room", room);
module.exports = Room;

