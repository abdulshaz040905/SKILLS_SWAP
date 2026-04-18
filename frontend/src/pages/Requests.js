// /frontend/src/pages/Requests.js

import React, { useEffect, useState } from "react";
import API from "../api";

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/swaps/my-requests");
      setIncoming(res.data.incoming);
      setOutgoing(res.data.outgoing);
    } catch (error) {
      console.log("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Accept / Reject request
  const handleAction = async (id, status) => {
    try {
      await API.patch(`/swaps/${id}`, { status });
      alert(`Request ${status}`);
      fetchRequests(); // refresh data
    } catch (error) {
      alert(error.response?.data?.message || "Error updating request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Swap Requests</h2>

      {/* Incoming Requests */}
      <h3>Incoming Requests</h3>
      {incoming.length === 0 ? (
        <p>No incoming requests</p>
      ) : (
        incoming.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <h4>{req.sender.name}</h4>
            <p>Email: {req.sender.email}</p>
            <p>Status: {req.status}</p>

            {req.status === "pending" && (
              <>
                <button
                  onClick={() => handleAction(req._id, "accepted")}
                  style={{ marginRight: "10px" }}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleAction(req._id, "rejected")}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))
      )}

      {/* Outgoing Requests */}
      <h3>Outgoing Requests</h3>
      {outgoing.length === 0 ? (
        <p>No outgoing requests</p>
      ) : (
        outgoing.map((req) => (
          <div
            key={req._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <h4>{req.receiver.name}</h4>
            <p>Email: {req.receiver.email}</p>
            <p>Status: {req.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Requests;