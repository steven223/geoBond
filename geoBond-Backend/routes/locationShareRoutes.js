const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const checkFreeLimit = require("../middlewares/checkFreeLimit");
const locationController = require("../controllers/locationController");

router.post("/request", authenticateJWT, checkFreeLimit, locationController.sendLocationRequest);
router.post("/respond", authenticateJWT, locationController.respondToRequest);
router.post("/accept", authenticateJWT, locationController.acceptRequest);
router.post("/remove", authenticateJWT, locationController.removeFriend);
//addFriend
router.post("/addFriend", authenticateJWT, locationController.addFriend);
//removeFriend
router.post("/removeFriend", authenticateJWT, locationController.removeFriend);
//acceptFriendRequest
router.post("/acceptFriendRequest", authenticateJWT, locationController.acceptRequest);
//getFriendList
router.get("/getFriendList", authenticateJWT, locationController.getMyFriends);

module.exports = router;