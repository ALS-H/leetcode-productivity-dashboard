// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";

// 🔐 Wrapper to protect dashboard route
const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  console.log("🔒 PrivateRoute | loading:", loading, "| user:", user, "| token:", token);

  if (loading) return <p>Loading auth...</p>;
  if (!user || !token) return <Navigate to="/login" replace />;
  return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect home to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
