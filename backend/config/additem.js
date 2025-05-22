import Item from "../models/item.js";
import User from "../models/user.js";

export const AddItem = async (req, res) => {
  const { userId, itemId } = req.body;

  console.log("User ID:", userId);
  console.log("Item ID:", itemId);

  if (!userId || !itemId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userDB = await User.findById(userId);

  if (!userDB) {
    return res.status(404).json({ message: "User not found" });
  }

  const itemDB = await Item.findById(itemId);

  if (!itemDB) {
    return res.status(404).json({ message: "Item not found" });
  }

  try {
    const getCartItems = userDB.cartList;
    const checkIfAlreadyInCart = getCartItems.includes(itemId);

    console.log(checkIfAlreadyInCart);

    if (checkIfAlreadyInCart) {
      return res.status(200).json({ message: "Item already in cart" });
      // return res.status(404).json({ message: "Item already in cart" });
    }

    userDB.cartList.push(itemId);
    await userDB.save();
    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default AddItem;
