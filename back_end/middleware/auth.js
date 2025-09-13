const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

function isManager(req, res, next) {
  if(req.user.role !== "manager") {
    return res.status(403).json({message : "Access denied: Managers only"})
  }
  next();
}

function isAdminOrManager(req, res, next) {
  if (req.user.role === "admin" || req.user.role === "manager") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins or Managers only" });
  }
}


module.exports = {auth, isAdmin, isManager, isAdminOrManager};