import React, { useState, useEffect } from "react";
import '../styles/Quote.css';
import { useAuth } from "../context/AuthContext"; // ✅ import auth context

const quotes = [
  "The best way to get started is to quit talking and begin doing.",
  "Don’t let yesterday take up too much of today.",
  "It’s not whether you get knocked down; it’s whether you get up.",
  "Dream bigger. Do bigger.",
  "Focus on being productive instead of busy.",
];

export default function Quote() {
  const { user, token, logout, loading } = useAuth();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (!loading && user) {
      // Only set a quote if user is authenticated
      const initial = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[initial]);
    }
  }, [loading, user]);

  const nextQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  if (loading) return <div className="quote-card">Loading...</div>;

  if (!user) return null; // 🚫 Don't show anything if not logged in

  return (
    <div className="quote-card">
      <header className="quote-header">Motivation</header>
      <div className="quote-content">
        <p className="quote-text">“{quote}”</p>
        <button className="quote-button" onClick={nextQuote}>
          New Quote
        </button>
      </div>
    </div>
  );
}
