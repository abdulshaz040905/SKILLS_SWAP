const express = require("express");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, skillsOffered, skillsWanted } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        skillsOffered,
        skillsWanted
      },
      { new: true }
    ).select("-password");
    

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

// FIND MATCHING USERS
router.get("/matches", verifyToken, async (req, res) => {
  try {
    // Get current logged-in user
    const currentUser = await User.findById(req.user.userId);

    const matches = await User.find({
      _id: { $ne: currentUser._id },

      skillsOffered: { $in: currentUser.skillsWanted },

      skillsWanted: { $in: currentUser.skillsOffered }
    }).select("-password");

    res.status(200).json(matches);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

module.exports = router;