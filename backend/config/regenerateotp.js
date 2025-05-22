import Order from "../models/order.js";
import { HashPassword } from "../models/hash.js";

export default async function RegenerateOtp(req,res) {
    const { itemId } = req.body;

  console.log("Regenerating OTP for item:", itemId);

  const myOrder = await Order.findOne({ itemId });

  if (!myOrder) {
    return res.status(404).json({ message: "Order not found" });
  }

  console.log("My order:", myOrder);

  const newOtp = Math.floor(100000 + Math.random() * 900000);

  try {
    myOrder.hashedOtp = await HashPassword(newOtp.toString());
    console.log("order.hashedOtp:", myOrder.hashedOtp);

    await myOrder.save();

    res
      .status(200)
      .json({ message: "OTP regenerated successfully", otp: newOtp });
  } catch (error) {
    console.error("Error hashing OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}