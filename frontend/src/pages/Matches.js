// /frontend/src/pages/Matches.js

import React, { useEffect, useState } from "react";
import API from "../api";

const Matches = () => {
  const [matches, setMatches] = useState([]);

  // Fetch matches from backend
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get("/users/matches");
        setMatches(res.data);
      } catch (error) {
        console.log("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, []);

  // Send swap request
  const sendRequest = async (receiverId) => {
    try {
      await API.post(`/swaps/send/${receiverId}`);
      alert("Request sent successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Matches</h2>

      {matches.length === 0 ? (
        <p>No matches found</p>
      ) : (
        matches.map((user) => (
          <div
            key={user._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <h3>{user.name}</h3>

            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Skills Offered:</strong>{" "}
              {user.skillsOffered?.join(", ") || "None"}
            </p>

            <p>
              <strong>Skills Wanted:</strong>{" "}
              {user.skillsWanted?.join(", ") || "None"}
            </p>

            <button
              onClick={() => sendRequest(user._id)}
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Send Swap Request
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Matches;