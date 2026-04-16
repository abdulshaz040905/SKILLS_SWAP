// /backend/middleware/verifyPremium.js

const User = require("../models/User");

const verifyPremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.isPremium) {
      return res.status(403).json({
        message: "Premium membership required"
      });
    }

    if (user.premiumExpires && user.premiumExpires < new Date()) {
      user.isPremium = false;
      user.premiumExpires = null;
      await user.save();

      return res.status(403).json({
        message: "Premium membership expired"
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

module.exports = verifyPremium;