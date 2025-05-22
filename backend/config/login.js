import mongoose from "mongoose";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { HashPassword, UnhashPassword } from "../models/hash.js";
import axios from "axios";

export const Login = async (req, res) => {
  const { email, password, recaptcha } = req.body;

  const secretKey = "6LetF8QqAAAAAG7rNCu0O_PWLrU6lk67gL366ub_"

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    new URLSearchParams({
      secret: secretKey,
      response: recaptcha,
    })
  );

  if (response.data.success === false) {
    return res.status(401).json({ message: "Captcha failed" });
  }

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await UnhashPassword(password, userExists.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "Login successful!", token });
};

export default Login;
