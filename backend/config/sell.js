import mongoose from "mongoose";
import Item from "../models/item.js";

export const Sell = async (req, res) => {
  const product = req.body;

  if (
    !product.name ||
    !product.price ||
    !product.description ||
    !product.category ||
    !product.sellerId ||
    !product.photo
  ) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const newItem = await Item.create(product);

  if (!newItem) {
    return res.status(400).json({ message: "Error creating item" });
  }

  try {
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default Sell;
