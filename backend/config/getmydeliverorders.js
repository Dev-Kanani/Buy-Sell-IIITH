import Order from "../models/order.js";

export default async function GetMyDeliverOrders(req, res) {
    const { userId } = req.query;

    console.log(userId);

    const orders = await Order.find({ sellerId: userId });

    if (!orders) {
        return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
}