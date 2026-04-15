const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//All Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const swapRoutes = require("./routes/swapRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swaps", swapRoutes);

app.get("/", (req, res) => {
  res.send("SkillSwap API is running...");
});

mongoose.connect("mongodb://127.0.0.1:27017/skillswap")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});