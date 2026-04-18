// /frontend/src/pages/Dashboard.js

import React, { useEffect, useState } from "react";
import API from "../api";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <p><strong>Skills Offered:</strong> {user.skillsOffered?.join(", ")}</p>
      <p><strong>Skills Wanted:</strong> {user.skillsWanted?.join(", ")}</p>

      <p>
        <strong>Premium:</strong> {user.isPremium ? "Yes" : "No"}
      </p>
    </div>
  );
};

export default Dashboard;