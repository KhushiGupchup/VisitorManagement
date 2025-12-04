const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ msg: "Access Denied - No Token" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7); // remove "Bearer "
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    // Fetch user from DB
    const user = await User.findOne({ empId: decoded.empId }).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Invalid Token" });
  }
};

module.exports = authMiddleware;
