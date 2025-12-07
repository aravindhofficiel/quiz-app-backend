const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id, role, email
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
    