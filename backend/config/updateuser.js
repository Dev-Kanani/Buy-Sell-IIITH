import mongoose from "mongoose";
import User from "../models/user.js";
import { HashPassword } from "../models/hash.js";

export const UpdateUser = async (req, res) => {
  const updatedUserData = req.body;

  console.log(updatedUserData);

  console.log(updatedUserData.email);

  if (!updatedUserData.email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (updatedUserData.password) {
    console.log("Password:", updatedUserData.password);
    updatedUserData.password = await HashPassword(updatedUserData.password);
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: updatedUserData.email },
      updatedUserData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default UpdateUser;
