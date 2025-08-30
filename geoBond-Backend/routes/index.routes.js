const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const locationShareRoutes = require("./locationShareRoutes");
const friendshipRoutes = require("./friendshipRoutes");
const chatRoutes = require("./chatRoutes");

router.use("/auth", authRoutes);
router.use("/location", locationShareRoutes);
router.use("/friendship", friendshipRoutes);
router.use("/chat", chatRoutes);

module.exports = router;