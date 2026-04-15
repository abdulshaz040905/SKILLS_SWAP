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

  // Join chat room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("sendMessage", async ({ roomId, message, sender }) => {
    try {
      // Save message to DB
      const savedMessage = await Message.create({
        roomId,
        sender,
        message,
      });

      // Emit to all users in room
      io.to(roomId).emit("receiveMessage", {
        _id: savedMessage._id,
        roomId: savedMessage.roomId,
        sender: savedMessage.sender,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
      });
    } catch (error) {
      console.log("Message Save Error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
