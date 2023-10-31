const express = require("express");
const app = express();
const http = require("http");
require("./utils/db");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/message");
const chatBot = "Chatbot Cord";
const userRoutes = require("./routes/userRoutes");
app.use(express.json());
app.use("/api/v1/user/", userRoutes);

// integrate static file
const path = require("path");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getUserRoom,
} = require("./utils/users");
app.use(express.static(path.join(__dirname, "public")));

// Run When CLient connects
io.on("connection", (socket) => {
  // let user = undefined;
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // 1) for the single client  Welcome to the client
    socket.emit("message", formatMessage(chatBot, "welocome to the chatcord"));
    // 2) for all the client except the client is login
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(chatBot, `${user.username} has joined the chat`)
      );

    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getUserRoom(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.emit(
        "message",
        formatMessage(chatBot, `${user.username} has left the chat`)
      );
    }
  });

  // listen for chat message
  socket.on("msg", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });
});

server.listen(3000, () => {
  console.log("Server is listining");
});
