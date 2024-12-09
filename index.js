const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const {
  notFound,
  errorHandler,
} = require("./backend/middleware/errorMiddleware");
const app = express();
const userRoutes = require("./backend/routes/userRoutes");
const path = require("node:path");

const Room = require("./backend/config/Chat");

dotenv.config();

app.use(express.json()); // to accept json data

const server = http.createServer(app);

app.use(cors()); //to enable  cors for all incoming requests

const url = process.env.MONGO_URL;
app.use("/api/user", userRoutes); //api routes for user related operations


// Endpoint to fetch chat messages based on a conversation ID
app.post("/api/user/chat", (req, res) => {
  convID = (req.body.username.toUpperCase() + req.body.friend.toUpperCase())
    .split("")
    .sort() 
    .join("");
  Room.findOne({ name: convID })
    .then((room) => {
      res.send(room.messages);
    })
    .catch((err) => {
      console.log(err);
    });
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected ", socket.id); // Logs the connected user's socket ID
  socket.on("disconnect", () => {
    console.log("user disconnected"); // Logs when a user disconnects
  });
});

// Endpoint to send and store chat messages
app.post("/api/user/messages", (req, res) => {
  const username = JSON.parse(req.body.username).name;

  convID = (username.toUpperCase() + req.body.friend.toUpperCase())
    .split("")
    .sort()
    .join("");
  let newDate = new Date(Date.now()).toLocaleString("en-GB");
  
  let messageData = {
    sender: username.toUpperCase(),
    message: req.body.message,
    dateCreated: newDate,
  };
  let newMessageData = {
    name: convID,
    participants: [username.toUpperCase(), req.body.friend.toUpperCase()],
    messages: messageData,
  };
  Room.findOne({ name: convID }).then((room) => {
    // Checks if the chat room already exists
    if (room) {
      room.messages.push(messageData);
      room.save();
      io.emit("newmessage", { message: messageData });
    } else {
      Room.create(newMessageData)
        .then((room) => {
          res.send("Added");
        })
        .catch((err) => {
          res.send("error" + err);
        });
    }
  });
});

mongoose.connect(url).then(() => {
  console.log("MongoDB server started");
});

// Middleware to handle 404 errors (route not found)
app.use(notFound);
// Middleware to handle other errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
