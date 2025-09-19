// server/signaling.js
const WebSocket = require("ws");

const PORT = 8888;
const wss = new WebSocket.Server({ port: PORT });

const rooms = {}; // { roomId: { clientId: ws } }

function broadcast(roomId, msg, excludeClient) {
  if (!rooms[roomId]) return;
  for (const [id, client] of Object.entries(rooms[roomId])) {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  }
}

wss.on("connection", (ws) => {
  let currentRoom = null;
  let clientId = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      const { type, roomId, to, payload, role } = data;

      if (type === "join") {
        clientId = Math.random().toString(36).slice(2, 10);
        currentRoom = roomId;

        if (!rooms[roomId]) rooms[roomId] = {};
        rooms[roomId][clientId] = ws;

        console.log(`[JOIN] ${role} joined room ${roomId} as ${clientId}`);

        ws.send(JSON.stringify({ type: "joined", clientId }));
        broadcast(roomId, { type: "peer-joined", from: clientId }, ws);
      }

      if (type === "offer" || type === "answer" || type === "ice") {
        if (to && rooms[currentRoom]?.[to]) {
          rooms[currentRoom][to].send(
            JSON.stringify({ type, from: clientId, payload })
          );
        }
      }

      if (type === "broadcast") {
        broadcast(currentRoom, { type: "broadcast", from: clientId, payload }, ws);
      }

      if (type === "leave") {
        if (currentRoom && rooms[currentRoom]) {
          delete rooms[currentRoom][clientId];
          broadcast(currentRoom, { type: "peer-left", from: clientId }, ws);
        }
      }
    } catch (err) {
      console.error("Invalid WS message", err);
    }
  });

  ws.on("close", () => {
    if (currentRoom && clientId && rooms[currentRoom]) {
      delete rooms[currentRoom][clientId];
      broadcast(currentRoom, { type: "peer-left", from: clientId }, ws);
    }
  });
});

console.log(`✅ Signaling server running on ws://localhost:${PORT}`);
