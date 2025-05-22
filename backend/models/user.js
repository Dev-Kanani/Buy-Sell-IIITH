import mongoose from "mongoose";
import Item from "./item.js";

const userdetailsSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@(students|research)\.iiit\.ac\.in$/, "Invalid IIIT email"],
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  age: {
    type: Number,
    required: true,
  },

  contactNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Invalid phone number"],
  },

  cartList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: false,
    },
  ],

  sellerReviews: [
    {
      reviewerName: {
        type: String,
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
      star: {
        type: Number,
        required: true,
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userdetailsSchema);

export default User;
