// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  // Socket.IO server
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    socket.on("event", (ev) => {
      console.log(" Event:", ev);
      io.emit("event", ev);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  //  Let Next.js handle all other routes
  server.all("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
});
