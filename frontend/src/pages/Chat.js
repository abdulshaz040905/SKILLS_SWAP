// /frontend/src/pages/Chat.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../api";

const socket = io("http://localhost:5000");

const Chat = () => {
  const { otherUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const currentUserId = localStorage.getItem("userId");

  // Generate roomId
  const roomId = [currentUserId, otherUserId].sort().join("_");

  // Join room + fetch history
  useEffect(() => {
    socket.emit("joinRoom", roomId);

    const fetchHistory = async () => {
      try {
        const res = await API.get(`/chat/history/${roomId}`);
        setMessages(res.data);
      } catch (error) {
        console.log("Error loading history:", error);
      }
    };

    fetchHistory();

    // Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      roomId,
      message: input,
      sender: currentUserId
    });

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>

      {/* Messages */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px"
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign:
                msg.sender === currentUserId ? "right" : "left",
              marginBottom: "5px"
            }}
          >
            <span
              style={{
                background: "#eee",
                padding: "5px 10px",
                borderRadius: "10px"
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;