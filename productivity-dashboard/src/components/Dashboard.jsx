// src/components/Dashboard.jsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import TodoList from "./TodoList";
import LeetCodeNotesList from "./LeetCodeNotesList";
import Clock from "./Clock";
import Quote from "./Quote";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

function Dashboard() {
  const { user, token, logout, loading } = useAuth();

  useEffect(() => {
    if (user && token) {
      console.log("✅ Logged in as:", user.email);
      console.log("✅ Token:", token);
    }
  }, [user, token]);

  // 🔄 Show loading while Firebase is resolving auth state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  // 🔐 Redirect to login if unauthenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
  <>
    <header className="dashboard-header">
      <h1 className="dashboard-title">Productivity Dashboard</h1>
      <div className="dashboard-user">
        <span>Welcome, {user.email}</span>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>

    <div className="dashboard-container">
      <div className="left-column">
        {/* ✅ Isolate this first */}
        <LeetCodeNotesList/> 
      </div>

      <div className="middle-column">
        <div className="card">
          <Clock/>
        </div>
        <div className="card">
          <Quote />
        </div>
      </div>

      <div className="right-column">
        <TodoList/>
      </div>
    </div>
  </>
);

}

export default Dashboard;
