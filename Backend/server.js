const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//All Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const swapRoutes = require("./routes/swapRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Message = require("./models/Message");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("SkillSwap API is running...");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/skillswap")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = 5000;
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Join room (same as chat)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  // WebRTC: Offer
  socket.on("callUser", ({ roomId, offer, sender }) => {
    socket.to(roomId).emit("incomingCall", {
      offer,
      sender
    });
  });

  // WebRTC: Answer
  socket.on("answerCall", ({ roomId, answer }) => {
    socket.to(roomId).emit("callAccepted", {
      answer
    });
  });

  // WebRTC: ICE candidates
  socket.on("iceCandidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("iceCandidate", {
      candidate
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
