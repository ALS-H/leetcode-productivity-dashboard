const express = require("express");
const router = express.Router();
const Session = require("../models/session");
const authMiddleware = require('../auth');

// 🔴 Helper: always extract uid from token
const getUserId = (req) => req.user.uid;

// 🚀 Start a new Pomodoro session
router.post("/start", authMiddleware, async (req, res) => {
  try {
    const newSession = new Session({
      user: getUserId(req),
      startTime: new Date(),
      completed: false,
      duration: 0,
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.error("❌ Error starting session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Complete a session and set duration
router.post("/complete/:id", authMiddleware, async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { duration } = req.body;
    const userId = getUserId(req);

    const updated = await Session.findOneAndUpdate(
      { _id: sessionId, user: userId },
      {
        duration: duration ?? 1500,
        completed: true,
        endTime: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Session not found or unauthorized" });
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ Error completing session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📊 Get total study time for logged-in user
router.get("/total", authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);

    const sessions = await Session.find({
      user: userId,
      completed: true,
    });

    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    res.json({ hours, minutes, seconds });
  } catch (error) {
    console.error("❌ Error getting total study time:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// 📂 Get all sessions for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    const sessions = await Session.find({ user: userId }).sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("❌ Error fetching sessions:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
});

// 🗑️ Delete a session (only if owned by user)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = getUserId(req);
    const deleted = await Session.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Session not found or unauthorized" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting session:", err);
    res.status(500).json({ message: "Failed to delete session" });
  }
});

module.exports = router;
