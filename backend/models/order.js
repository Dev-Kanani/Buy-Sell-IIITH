import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  hashedOtp: {
    type: String,
    required: true,
  },

  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
    unique: true,
  },

  orderStatus: {
    type: String,
    default: "Pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
