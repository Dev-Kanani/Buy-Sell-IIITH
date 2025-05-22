import Item from "../models/item.js";

export const SearchAll = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default SearchAll;
