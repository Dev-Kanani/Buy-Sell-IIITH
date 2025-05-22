import Order from "../models/order.js";
import Item from "../models/item.js";
import User from "../models/user.js";
import { HashPassword } from "../models/hash.js";

export default async function Checkout(req, res) {
  const { buyerId, sellerId, amount, otp, itemId } = req.body;

  const hashedOtp = await HashPassword(otp);

  const order = new Order({
    buyerId,
    sellerId,
    amount,
    hashedOtp,
    itemId,
  });

  console.log(order);

  try {
    const findItem = await Item.findById(itemId);

    if (!findItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (findItem.isSold) {
      return res.status(400).json({ message: "Item already sold" });
    }

    findItem.isSold = true;

    await findItem.save();

    await order.save();

    const user = await User.findById(buyerId);

    const tempCart = user.cartList;

    for (let i = 0; i < tempCart.length; i++) {
      if (tempCart[i].toString() === itemId) {
        tempCart.splice(i, 1);
        break;
      }
    }

    user.cartList = tempCart;

    await user.save();

    res.status(200).json({ message: "Order placed successfully" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}