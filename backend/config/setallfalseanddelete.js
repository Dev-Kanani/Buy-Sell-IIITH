import Item from "../models/item.js";
import Order from "../models/order.js";
export default async function SetAllFalseAndDelete(req,res) {
    const allItems = await Item.find({});

    for (let i = 0; i < allItems.length; i++) {
        allItems[i].isSold = false;
        await allItems[i].save();
    }

    await Order.deleteMany({});

    res
        .status(200)
        .json({ message: "All items set to false and orders deleted" });

    // console.log(allItems);
}