import Item from "../models/item.js";
import User from "../models/user.js";

export default async function GetSellerName(req,res) {
    const allProducts = await Item.find({});

    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i]._id.toString() === req.query.productId) {
            const sellerId = allProducts[i].sellerId;

            const seller = await User.findById(sellerId);

            const fullName = seller.firstName + " " + seller.lastName;

            return res.status(200).json({ sellerName: fullName });
        }
    }

    res.status(404).json({ message: "Product not found" });
}