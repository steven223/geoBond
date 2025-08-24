const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const checkFreeLimit = require("../middlewares/checkFreeLimit");
const { sendLocationRequest, respondToRequest } = require("../controllers/locationController");
const authController = require("../controllers/authController");


router.post("/request", authenticateJWT, checkFreeLimit, sendLocationRequest);
router.post("/respond", authenticateJWT, respondToRequest);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/updateProfile", authenticateJWT, authController.updateProfile);
router.get("/getProfile", authenticateJWT, authController.getProfile);
router.post("/updateLocation", authenticateJWT, authController.updateLocation);
router.get("/getAllUsers", authenticateJWT, authController.getAllUsers);
router.get("/user/:userId", authenticateJWT, authController.getUserById);

module.exports = router;