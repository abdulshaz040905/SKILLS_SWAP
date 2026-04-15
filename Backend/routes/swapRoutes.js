// /backend/routes/swapRoutes.js

const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const SwapRequest = require("../models/SwapRequest");

const router = express.Router();

// SEND SWAP REQUEST
router.post("/send/:receiverId", verifyToken, async (req, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.receiverId;

    // Prevent sending request to self
    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot send request to yourself"
      });
    }

    // Check if request already exists
    const existingRequest = await SwapRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent"
      });
    }

    const swapRequest = await SwapRequest.create({
      sender: senderId,
      receiver: receiverId
    });

    res.status(201).json({
      message: "Swap request sent successfully",
      swapRequest
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

// GET MY SWAP REQUESTS
router.get("/my-requests", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const incoming = await SwapRequest.find({
      receiver: userId
    })
      .populate("sender", "name email skillsOffered skillsWanted")
      .sort({ createdAt: -1 });

    const outgoing = await SwapRequest.find({
      sender: userId
    })
      .populate("receiver", "name email skillsOffered skillsWanted")
      .sort({ createdAt: -1 });

    res.status(200).json({
      incoming,
      outgoing
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

// ACCEPT / REJECT SWAP REQUEST
router.patch("/:requestId", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.requestId;

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const swapRequest = await SwapRequest.findById(requestId);

    if (!swapRequest) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    // Only receiver can accept/reject
    if (swapRequest.receiver.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Unauthorized action"
      });
    }

    swapRequest.status = status;
    await swapRequest.save();

    res.status(200).json({
      message: `Request ${status} successfully`,
      swapRequest
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

module.exports = router;