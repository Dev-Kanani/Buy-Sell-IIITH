import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password"); // Exclude password

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
