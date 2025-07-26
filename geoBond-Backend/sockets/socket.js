// sockets/socket.js
const LocationShare = require("../models/LocationShare");
const UserLocation = require("../models/UserLocation");
const activeSockets = {};

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);
    socket.on("register", (userId) => {
      activeSockets[userId] = socket.id;
      console.log("✅ User logged in:", userId);
    });

    socket.on("location:update", async ({ userId, lat, lng }) => {
      try {
        const acceptedShares = await LocationShare.find({
          fromUserId: userId,
          status: "accepted"
        });

        for (const share of acceptedShares) {
          const receiverSocketId = activeSockets[share.toUserId.toString()];
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("location:receive", { userId, lat, lng });
          }
        }
      } catch (err) {
        console.error("❌ Error broadcasting location:", err);
      }
    });

    socket.on("disconnect", () => {
      for (const userId in activeSockets) {
        if (activeSockets[userId] === socket.id) {
          delete activeSockets[userId];
          break;
        }
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

module.exports = { setupSocket };
