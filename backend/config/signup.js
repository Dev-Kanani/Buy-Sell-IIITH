import mongoose from "mongoose";
import User from "../models/user.js";
import { HashPassword } from "../models/hash.js";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  const { firstName, lastName, email, password, age, contactNumber } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !age ||
    !contactNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log("Signup Request:", req.body);

  const users = await User.find({});

  const check = users.find((u) => u.email === email);

  if (check) {
    return res.status(200).json({ message: "Email already exists!" });
  }

  const isEmailCorrect = email.includes("@students.iiit.ac.in") || email.includes("@research.iiit.ac.in");

  if (!isEmailCorrect) {
    return res.status(200).json({ message: "Please use your IIIT email id" });
  }

  try {
    const hashedPassword = await HashPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      contactNumber,
    });


    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default Signup;
