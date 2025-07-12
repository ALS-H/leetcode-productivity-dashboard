// src/components/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ Login successful:", user);

      const token = await user.getIdToken();
      console.log("🎟️ Token:", token.slice(0, 10) + "...");

      // Wait for AuthContext to pick up the login before navigating
      setTimeout(() => navigate("/dashboard"), 500); // optional delay
    } catch (error) {
      console.error("❌ Login failed:", error.code, error.message);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="toggle-auth">
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#007b8a", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
