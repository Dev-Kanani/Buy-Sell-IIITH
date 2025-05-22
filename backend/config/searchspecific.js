import Item from "../models/item.js";

export const SearchSpecific = async (req, res) => {
  const letters = req.query.query;

  console.log(letters);

  if (!letters) {
    return res.status(400).json({ message: "Invalid search query" });
  }

  try {
    const listOfItems = [];

    const allItems = await Item.find({});

    allItems.forEach((item) => {
      if (item.name.toLowerCase().includes(letters.toLowerCase())) {
        listOfItems.push(item);
      }
    });

    res.status(200).json(listOfItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default SearchSpecific;
