// /backend/routes/chatRoutes.js

const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const SwapRequest = require("../models/SwapRequest");
const Message = require("../models/Message");
const verifyPremium = require("../middleware/verifyPremium");



const router = express.Router();

// CHECK CHAT ACCESS
router.get("/access/:otherUserId", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = req.params.otherUserId;

    const acceptedSwap = await SwapRequest.findOne({
      status: "accepted",
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    });

    if (!acceptedSwap) {
      return res.status(403).json({
        message: "Chat not allowed until swap request is accepted"
      });
    }

    res.status(200).json({
      message: "Chat access granted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});


// GET CHAT HISTORY
router.get("/history/:roomId", verifyToken, async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const messages = await Message.find({ roomId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});


// VIDEO CALL ACCESS
router.get(
  "/video-call/:otherUserId",
  verifyToken,
  verifyPremium,
  async (req, res) => {
    try {
      const currentUserId = req.user.userId;
      const otherUserId = req.params.otherUserId;

      const acceptedSwap = await SwapRequest.findOne({
        status: "accepted",
        $or: [
          { sender: currentUserId, receiver: otherUserId },
          { sender: otherUserId, receiver: currentUserId }
        ]
      });

      if (!acceptedSwap) {
        return res.status(403).json({
          message: "Video call allowed only for accepted swaps"
        });
      }

      res.status(200).json({
        message: "Video call access granted"
      });

    } catch (error) {
      res.status(500).json({
        message: "Server Error",
        error: error.message
      });
    }
  }
);

module.exports = router;