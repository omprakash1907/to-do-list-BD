const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not found in DB" });
      }

      console.log("✅ Authenticated User:", req.user);
      next();
    } catch (error) {
      console.error("❌ Token Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized: Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = { protect };
