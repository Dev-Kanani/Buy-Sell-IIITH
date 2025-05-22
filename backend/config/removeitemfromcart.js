import User from "../models/user.js";

export default async function RemoveItemFromCart(req,res) {

    const { userId, itemId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.cartList = user.cartList.filter((item) => item.toString() !== itemId);

    try {
        await user.save();
        return res.status(200).json({ message: "Item removed from cart" });
    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
}