const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const locationShareRoutes = require("./locationShareRoutes");

router.use("/auth", authRoutes);
router.use("/location", locationShareRoutes);

module.exports = router;