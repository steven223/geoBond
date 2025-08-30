// index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { connectRedis } = require("./config/redis");
const { setupSocket } = require("./sockets/socket");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes placeholder
app.get("/", (req, res) => res.send("GeoBond API with Chat"));

const io = new Server(server, {
  cors: { origin: "*" },
  transports: ['websocket', 'polling']
});

// Setup Redis adapter for Socket.IO (optional - will work without Redis)
const setupRedisAdapter = async () => {
  try {
    const redisClient = await connectRedis();
    if (redisClient) {
      const subClient = redisClient.duplicate();
      await subClient.connect();
      io.adapter(createAdapter(redisClient, subClient));
      console.log("✅ Socket.IO Redis adapter configured");
    } else {
      console.log("⚠️ Running without Redis adapter");
    }
  } catch (err) {
    console.log("⚠️ Redis adapter setup failed, continuing without it:", err.message);
  }
};

// Connect Socket.io
setupSocket(io);

// Import and use routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ MongoDB connected");
  
  // Setup Redis adapter
  await setupRedisAdapter();
  
  server.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 GeoBond Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch(err => console.error("❌ MongoDB connection error:", err));
