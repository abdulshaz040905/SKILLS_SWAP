// /backend/routes/paymentRoutes.js

const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

const router = express.Router();

// UPGRADE TO PREMIUM
router.post("/upgrade", verifyToken, async (req, res) => {
  try {
    const premiumExpiry = new Date();
    premiumExpiry.setMonth(premiumExpiry.getMonth() + 1);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        isPremium: true,
        premiumExpires: premiumExpiry
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Premium activated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

module.exports = router;