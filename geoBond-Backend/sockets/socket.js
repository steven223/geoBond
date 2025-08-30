const LocationShare = require("../models/LocationShare");
const UserLocation = require("../models/UserLocation");
const FriendRequest = require("../models/FriendRequest");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const activeSockets = {};

function setupSocket(io) {
  // Function to broadcast connected users count
  const broadcastConnectedUsersCount = () => {
    const connectedUsersCount = Object.keys(activeSockets).length;
    io.emit("users:count", { count: connectedUsersCount });
    console.log(`📊 Broadcasting connected users count: ${connectedUsersCount}`);
  };

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("register", (userId) => {
      activeSockets[userId] = socket.id;
      console.log("✅ User logged in:", userId);
      
      // Broadcast updated count when user registers
      broadcastConnectedUsersCount();
    });

    socket.on("location:update", async ({ userId, lat, lng, accuracy, timestamp }) => {
      try {
        // https://us1.locationiq.com/v1/reverse?key=Your_API_Access_Token&lat=51.50344025&lon=-0.12770820958562096&format=json&
        // const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        // https://api.mapbox.com/geocoding/v5/mapbox.places/{lng},{lat}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN
        // const url = `${process.env.MAPBOX_URL}access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
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

    // Chat functionality
    socket.on("chat:join", (conversationId) => {
      socket.join(conversationId);
      console.log(`💬 User joined chat room: ${conversationId}`);
    });

    socket.on("chat:leave", (conversationId) => {
      socket.leave(conversationId);
      console.log(`💬 User left chat room: ${conversationId}`);
    });

    socket.on("chat:message", async (data) => {
      try {
        const { conversationId, content, messageType = 'text', replyTo } = data;
        const userId = Object.keys(activeSockets).find(key => activeSockets[key] === socket.id);
        
        if (!userId) {
          socket.emit("chat:error", { message: "User not authenticated" });
          return;
        }

        // Verify user is part of conversation
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId
        });

        if (!conversation) {
          socket.emit("chat:error", { message: "Conversation not found" });
          return;
        }

        // Create message
        const message = await Message.create({
          conversationId,
          sender: userId,
          content: content.trim(),
          messageType,
          replyTo: replyTo || null
        });

        // Update conversation's last activity and last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastActivity: new Date()
        });

        // Populate message for broadcast
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'fullName email')
          .populate('replyTo');

        // Broadcast to all users in the conversation
        io.to(conversationId).emit("chat:message", populatedMessage);

        // Send delivery confirmation to sender
        socket.emit("chat:message:sent", { messageId: message._id });

        console.log(`💬 Message sent in conversation ${conversationId}`);
      } catch (err) {
        console.error("❌ Error handling chat message:", err);
        socket.emit("chat:error", { message: "Failed to send message" });
      }
    });

    socket.on("chat:typing", (data) => {
      const { conversationId, isTyping } = data;
      const userId = Object.keys(activeSockets).find(key => activeSockets[key] === socket.id);
      
      if (userId) {
        socket.to(conversationId).emit("chat:typing", {
          userId,
          isTyping,
          conversationId
        });
      }
    });

    socket.on("chat:read", async (data) => {
      try {
        const { conversationId } = data;
        const userId = Object.keys(activeSockets).find(key => activeSockets[key] === socket.id);
        
        if (!userId) return;

        // Mark messages as read
        await Message.updateMany(
          {
            conversationId,
            sender: { $ne: userId },
            'readBy.user': { $ne: userId }
          },
          {
            $push: {
              readBy: {
                user: userId,
                readAt: new Date()
              }
            },
            status: 'read'
          }
        );

        // Notify other participants
        socket.to(conversationId).emit("chat:read", {
          userId,
          conversationId,
          readAt: new Date()
        });

        console.log(`💬 Messages marked as read in conversation ${conversationId}`);
      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
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
      
      // Broadcast updated count when user disconnects
      broadcastConnectedUsersCount();
    });
  });
}

module.exports = { setupSocket };
