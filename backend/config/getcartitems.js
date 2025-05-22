import User from "../models/user.js";
import Item from "../models/item.js";

export const GetCartItems = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const userDB = await User.findById(userId);

  console.log(userDB);

  const cartItems = [];

  for (let i = 0; i < userDB.cartList.length; i++) {
    const itemInUserDB = userDB.cartList[i];

    cartItems.push(await Item.findById(itemInUserDB));
  }

  console.log(cartItems);

  res.status(200).json(cartItems);
};

export default GetCartItems;
