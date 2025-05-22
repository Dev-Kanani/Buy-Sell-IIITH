import Order from "../models/order.js";

export const  GetMyBuyedOrders = async (req, res) => {
    const { userId } = req.query;

    console.log(userId);

    const orders = await Order.find({ buyerId: userId });

    if (!orders) {
        return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
}

export default GetMyBuyedOrders;