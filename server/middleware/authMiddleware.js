import jwt from "jsonwebtoken";
import User from "../models/User.js";
export default async function protect(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token)
    return res.status(401).json({ message: "Please sign in to continue." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    req.user = await User.findById(decoded.id).select(
      "-password -passwordResetToken -passwordResetExpires",
    );
    if (!req.user)
      return res
        .status(401)
        .json({
          message: "Your account could not be found. Please sign in again.",
        });
    if (
      req.user.passwordChangedAt &&
      decoded.iat * 1000 <= new Date(req.user.passwordChangedAt).getTime()
    )
      return res
        .status(401)
        .json({ message: "Please sign in with your new password." });
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Your session has expired. Please sign in again." });
  }
}
