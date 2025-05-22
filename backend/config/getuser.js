import mongoose from "mongoose";
import User from "../models/user.js";

export const GetUser = async (req, res) => {
  const givenEmail = req.query.email;

  if (!givenEmail || typeof givenEmail !== "string") {
    return res.status(400).json({ message: "Invalid email" });
  }

  // console.log(givenEmail);

  try {
    const user = await User.findOne({ email: givenEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default GetUser;
