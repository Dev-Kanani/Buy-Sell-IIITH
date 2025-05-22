import axios from "axios";
import dotenv from "dotenv";
import User from "../models/user.js";
import Item from "../models/item.js";
import Order from "../models/order.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const chatWithGemini = async (message, userId, chatHistory) => {
  try {
    console.log("User Query:", message);
    console.log("User ID:", userId);

    userId = userId || "6792a2430abc02792b9f3460";

    console.log("User ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return "Sorry, I couldn't find your information. Please log in.";
    }

    const allProducts = await Item.find({});

    const productDetails = await Promise.all(allProducts.map(async (item) => {
      const sellerInfo = await User.findById(item.sellerId);

      const sellerDetails = sellerInfo
        ? `${sellerInfo.firstName} ${sellerInfo.lastName} - ${sellerInfo.email} - ${sellerInfo.contactNumber}`
        : "Seller information unavailable";

      return `
        Product Name: ${item.name}
        Price: ${item.price}
        Description: ${item.description}
        Category: ${item.category}
        Sold Status: ${item.isSold ? "Sold" : "Available"}
        Seller Info: ${sellerDetails}
      `;
    }));

    const productDetailsString = productDetails.join("\n\n");

    const cartItems = await Promise.all(user.cartList.map(async (itemId) => {
      return await Item.findById(itemId);
    }));

    const namesInCart = cartItems.map(item => item.name).join(", ");

    const myOrders = await Order.find({ buyerId: userId });

    const orderDetails = myOrders.map(order => {
      const itemInfo = allProducts.find(item => item._id.toString() === order.itemId.toString());
      const sellerInfo = User.findById(order.sellerId);
      return `
        Order ID: ${order._id}
        Item: ${itemInfo.name}
        Price: ${itemInfo.price}
        Amount: ${order.amount}
        Order Status: ${order.orderStatus}
        Seller: ${sellerInfo.firstName} ${sellerInfo.lastName}
      `;
    }).join("\n\n");

    const reviews = user.sellerReviews.map(review => {
      return `
        Reviewer: ${review.reviewerName}
        Review: ${review.review}
        Rating: ${review.star} stars
      `;
    }).join("\n\n");

    const historyContext = chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join("\n");

    console.log("User History:", historyContext);

    const context = `
      User Information:
      - Username: ${user.firstName} ${user.lastName}
      - Email: ${user.email}
      - Age: ${user.age}
      - Contact: ${user.contactNumber}

      Cart Items: ${namesInCart || "No items in cart"}

      Available Products:
      ${productDetailsString}

      Orders:
      ${orderDetails || "No orders placed yet."}

      Reviews for Sellers:
      ${reviews || "No reviews yet."}

      Chat History:
      ${historyContext}

      User's current query: ${message}
    `;

    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ parts: [{ text: context + "\n" + message }] }],
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error with Gemini API:", error.response?.data || error.message);
    return "Sorry, I couldn't process your request.";
  }
};
