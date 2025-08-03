// sockets/socket.js
const LocationShare = require("../models/LocationShare");
const UserLocation = require("../models/UserLocation");
const FriendRequest = require("../models/FriendRequest");
const activeSockets = {};

function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("register", (userId) => {
      activeSockets[userId] = socket.id;
      console.log("✅ User logged in:", userId);
    });

    socket.on("location:update", async ({ userId, lat, lng, accuracy, timestamp }) => {
      try {
        // https://us1.locationiq.com/v1/reverse?key=Your_API_Access_Token&lat=51.50344025&lon=-0.12770820958562096&format=json&
        // const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        // https://api.mapbox.com/geocoding/v5/mapbox.places/{lng},{lat}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN
        // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
        // const response = await fetch(url, {
        //   headers: { 'User-Agent': 'geoBond/1.0 (mehtashiv223@gmail.com)' }
        // });
        // const data = await response.json();
        // console.log("Data:", data.features[0]);
        // const address = data.features[0];
        // Save location to UserLocation model
        await UserLocation.create({
          userId,
          latitude: lat,
          longitude: lng,
          accuracy: accuracy || 0,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          // allUserAddress: address
        });

        // Get user's friends (accepted friend requests)
        const friendships = await FriendRequest.find({
          $or: [
            { fromUserId: userId },
            { toUserId: userId }
          ],
          status: 'accepted'
        });

        // Broadcast location to all friends
        for (const friendship of friendships) {
          const friendId = friendship.fromUserId.equals(userId)
            ? friendship.toUserId.toString()
            : friendship.fromUserId.toString();

          const friendSocketId = activeSockets[friendId];
          if (friendSocketId) {
            io.to(friendSocketId).emit("location:receive", {
              userId,
              lat,
              lng,
              accuracy,
              timestamp
            });
          }
        }

        console.log(`📍 Location updated for user ${userId} and shared with ${friendships.length} friends`);
      } catch (err) {
        console.error("❌ Error handling location update:", err);
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
