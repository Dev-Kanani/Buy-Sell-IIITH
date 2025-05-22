import Item from "../models/item.js";

export default async function GetItemData(req, res) {
    try {
        const itemId = req.query.productId; 

        if (!itemId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        console.log("Fetching item data for ID:", itemId);

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}