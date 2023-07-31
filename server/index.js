const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const route = require("./route");
const { addUser, findUser, getRoomsUsers, removeUser } = require("./users");

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room, lang }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room, lang });

    const userMessage = isExist
      ? `${user.name}, here you go again `
      : `Hello ${user.name}`;

    socket.emit("message", {
      data: { user: { name: "Admin" }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: { user: { name: "Admin" }, message: `${user.name} has joined` },
    });

    io.to(user.room).emit("room", {
      data: { users: getRoomsUsers(user.room) },
    });
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);

    console.log("message ->", message);
    console.log("params ->", params);

    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  socket.on("leftRoom", ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;

      io.to(room).emit("message", {
        data: { user: { name: "Admin" }, message: `${name} has left` },
      });

      io.to(room).emit("room", {
        data: { users: getRoomsUsers(room) },
      });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

server.listen(5000, () => {
  console.log("==== Server is running ====");
});
