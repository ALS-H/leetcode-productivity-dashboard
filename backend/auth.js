// auth.js or authMiddleware.js
const admin = require("./firebaseAdmin"); // ✅ Add this at the top

const authMiddleware = async (req, res, next) => {
  try {
    console.log("📥 authMiddleware triggered");

    const authHeader = req.headers.authorization;
    console.log("🔍 Incoming Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    console.log("✅ Authenticated request from user:", decoded.uid);
    next();
  } catch (err) {
    console.error("❌ Firebase token verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
