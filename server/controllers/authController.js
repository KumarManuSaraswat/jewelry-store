import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
const validEmail = (email) =>
  typeof email === "string" &&
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  Buffer.byteLength(password, "utf8") <= 72;
const validIdentity = (body) =>
  validEmail(body.email) &&
  validPassword(body.password) &&
  typeof body.name === "string" &&
  body.name.trim().length > 0 &&
  body.name.length <= 100;
export const registerUser = async (req, res) => {
  if (!validIdentity(req.body))
    return res
      .status(400)
      .json({
        message:
          "Please enter a name, valid email, and a password of at least 8 characters (maximum 72 bytes).",
      });
  try {
    const email = req.body.email.trim().toLowerCase();
    if (await User.findOne({ email }))
      return res
        .status(409)
        .json({
          message: "An account with this email already exists. Please sign in.",
        });
    const user = await User.create({
      name: req.body.name.trim(),
      email,
      password: req.body.password,
      role: "customer",
    });
    res
      .status(201)
      .json({ ...publicUser(user), token: generateToken(user._id) });
  } catch {
    res
      .status(500)
      .json({ message: "Unable to create your account. Please try again." });
  }
};
export const loginUser = async (req, res) => {
  if (!validEmail(req.body.email) || typeof req.body.password !== "string")
    return res
      .status(400)
      .json({ message: "Please enter your email and password." });
  try {
    const user = await User.findOne({
      email: req.body.email.trim().toLowerCase(),
    });
    if (!user || !(await user.matchPassword(req.body.password)))
      return res
        .status(401)
        .json({ message: "The email or password is incorrect." });
    res.json({ ...publicUser(user), token: generateToken(user._id) });
  } catch {
    res.status(500).json({ message: "Unable to sign in. Please try again." });
  }
};
export const forgotPassword = async (req, res) => {
  if (!validEmail(req.body.email))
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.EMAIL_FROM ||
    !process.env.CLIENT_URL
  )
    return res
      .status(503)
      .json({
        message:
          "Email recovery is not available yet. Please contact Orniva for account support.",
      });
  try {
    const user = await User.findOne({
      email: req.body.email.trim().toLowerCase(),
    });
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
      await user.save();
      const resetUrl =
        process.env.CLIENT_URL.replace(/\/$/, "") + "/reset-password/" + token;
      const sent = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.RESEND_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: [user.email],
          subject: "Reset your Orniva password",
          text:
            "Use this link to reset your Orniva password. It expires in 15 minutes.\n\n" +
            resetUrl +
            "\n\nIf you did not request this, you can ignore this email.",
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!sent.ok) throw new Error("Email delivery failed");
    }
    res.json({
      message:
        "If an account uses that email, a reset link will arrive shortly.",
    });
  } catch {
    res
      .status(503)
      .json({
        message: "We couldn’t send a recovery email. Please try again later.",
      });
  }
};
export const resetPassword = async (req, res) => {
  if (!validPassword(req.body.password))
    return res
      .status(400)
      .json({
        message: "Please use at least 8 characters (maximum 72 bytes).",
      });
  try {
    const hash = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hash,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({
          message:
            "This link has expired or is invalid. Request a new reset link.",
        });
    user.password = req.body.password;
    user.passwordChangedAt = new Date();
    user.passwordResetToken = "";
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ message: "Your password has been updated. Please sign in." });
  } catch {
    res
      .status(500)
      .json({ message: "Unable to reset your password. Please try again." });
  }
};
export const createAdminUser = async (req, res) => {
  if (!validIdentity(req.body))
    return res
      .status(400)
      .json({
        message:
          "Please enter a name, valid email, and a password of at least 8 characters.",
      });
  try {
    const email = req.body.email.trim().toLowerCase();
    if (await User.findOne({ email }))
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    const user = await User.create({
      name: req.body.name.trim(),
      email,
      password: req.body.password,
      role: "admin",
    });
    res.status(201).json(publicUser(user));
  } catch {
    res.status(500).json({ message: "Unable to create the team account." });
  }
};
