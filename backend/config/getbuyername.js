import Order from "../models/order.js";
import User from "../models/user.js";


export default async function GetBuyerName(req,res) {
    const { productId } = req.query;

    const order = await Order.findOne({ itemId: productId });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const buyer = await User.findById(order.buyerId);

    const fullName = buyer.firstName + " " + buyer.lastName;

    res.status(200).json({ buyerName: fullName });
}