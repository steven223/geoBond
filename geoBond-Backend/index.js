// index.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { setupSocket } = require("./sockets/socket");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes placeholder
app.get("/", (req, res) => res.send("Location Sharing API"));
const io = new Server(server, {
  cors: { origin: "*" }
});
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
.then(() => {
  console.log("✅ MongoDB connected");
  server.listen(process.env.PORT || 5000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch(err => console.error("❌ MongoDB connection error:", err));
