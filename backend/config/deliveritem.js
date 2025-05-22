import Order from "../models/order.js";
import { UnhashPassword } from "../models/hash.js";

export default async function DeliverItem(req, res) {
    const { itemId, otp } = req.body;

    console.log("Delivering item:", itemId);
    console.log("OTP:", otp);

    try {
        const myOrder = await Order.findOne({ _id: itemId });

        if (!myOrder) {
            console.log("Order not found");
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("My order:", myOrder);

        const isMatch = await UnhashPassword(otp, myOrder.hashedOtp);

        if (!isMatch) {
            console.log("Incorrect OTP");
            return res.status(200).json({ message: "Incorrect OTP" });
        }

        myOrder.orderStatus = "Delivered";
        await myOrder.save();

        res.status(200).json({ message: "Item delivered successfully" });
    } catch (error) {
        console.error("Error delivering item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}