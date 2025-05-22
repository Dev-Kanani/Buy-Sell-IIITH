import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import Signup from "./config/signup.js";
import Login from "./config/login.js";
import Sell from "./config/sell.js";
import GetUser from "./config/getuser.js";
import UpdateUser from "./config/updateuser.js";
import SearchSpecific from "./config/searchspecific.js";
import AddItem from "./config/additem.js";
import SearchAll from "./config/searchall.js";
import GetCartItems from "./config/getcartitems.js";
import User from "./models/user.js";
import authMiddleware from "./config/authmiddle.js";
import cookieParser from "cookie-parser";
import Order from "./models/order.js";
import Item from "./models/item.js";
import DeliverItem from "./config/deliveritem.js";
import RegenerateOtp from "./config/regenerateotp.js";
import GetBuyerName from "./config/getbuyername.js";
import RemoveItemFromCart from "./config/removeitemfromcart.js";
import Checkout from "./config/checkout.js";
import GetItemData from "./config/getitemdata.js";
import GetMyDeliverOrders from "./config/getmydeliverorders.js";
import SetAllFalseAndDelete from "./config/setallfalseanddelete.js";
import GetMyBuyedOrders from "./config/getmybuyedorders.js";
import GetSellerName from "./config/getsellername.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

console.log(process.env.MONGO_URI);

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});

app.post("/api/login", Login);
app.post("/api/signup", Signup);
app.post("/api/sell", Sell);
app.get("/api/getUser", authMiddleware, GetUser);
app.put("/api/updateUser", authMiddleware, UpdateUser);
app.get("/api/searchAll", authMiddleware, SearchAll);
app.get("/api/searchSpecific", authMiddleware, SearchSpecific);
app.post("/api/addItem", AddItem);
app.get("/api/getCartItems", authMiddleware, GetCartItems);
app.get("/api/getSellerName", authMiddleware, GetSellerName);
app.get("/api/getMyBuyedOrders", authMiddleware, GetMyBuyedOrders);
app.get("/api/getItemData", authMiddleware, GetItemData);
app.get("/api/getMyDeliverOrders", authMiddleware, GetMyDeliverOrders);
app.get("/api/getBuyerName", authMiddleware, GetBuyerName);
app.post("/api/regenerateOtp", authMiddleware, RegenerateOtp);
app.post("/api/deliverItem", authMiddleware, DeliverItem);
app.post("/api/setAllFalseAndDeleteItems", SetAllFalseAndDelete);
app.post("/api/removeItemFromCart", authMiddleware, RemoveItemFromCart);
app.post("/api/checkout", authMiddleware, Checkout);

app.get("/api/currentUser", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const email = req.user.email;

  console.log("User ID:", userId);
  console.log("Email:", email);

  res.status(200).json({ userId, email });
});


app.get("/api/getOrders", authMiddleware, async (req, res) => {
  const orders = await Order.find({});

  res.status(200).json(orders);
});

app.get("/api/product/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Item.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // console.log(product);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/getAllUsers", authMiddleware, async (req, res) => {
  const allUsers = await User.find({});
  res.status(200).json(allUsers);
});

import { chatWithGemini } from "./config/chatbot.js";

app.post("/api/chatbot", async (req, res) => {
  const { message, userId, chatHistory } = req.body;
  const response = await chatWithGemini(message, userId, chatHistory);
  res.json({ reply: response });
});

import mongoose from "mongoose";

app.post("/api/postReview", authMiddleware, async (req, res) => {
  try {
    const { userName, review, rating, productId } = req.body;

    if (!userName || !review || !rating || !productId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const itemId = String(productId);
    const reviewerName = String(userName);

    console.log("Review:", review);
    console.log("Rating:", rating);
    console.log("Item ID:", itemId);
    console.log("Reviewer Name:", reviewerName);

    const itemInDb = await Item.findById(itemId);
    if (!itemInDb) {
      return res.status(404).json({ message: "Item not found" });
    }

    const findSellerById = await User.findById(itemInDb.sellerId);
    if (!findSellerById) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const star = Number.isInteger(Number(rating)) ? Number(rating) : 0;

    const newReview = {
      reviewerName,
      review,
      star,
      productId: new mongoose.Types.ObjectId(itemId),
    };

    findSellerById.sellerReviews = findSellerById.sellerReviews || [];
    findSellerById.sellerReviews.push(newReview);

    await findSellerById.save();

    res.status(200).json({ message: "Review posted successfully" });
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

import { handleCASCallback } from "./config/caslogin.js";
import { initiateCASLogin } from "./config/caslogin.js";

app.get("/api/cas-login", initiateCASLogin);
app.get("/api/cas-callback", handleCASCallback);

app.post("/api/logout", (req, res) => {
  res.redirect("http://localhost:5173/login");
});

app.get("/api/getAllItemsIAmSelling", authMiddleware, async (req, res) => {

  const userId = req.user.id;

  console.log("User ID here:", userId);



  const items = await Item.find({ sellerId: userId });

  console.log("Items:", items);

  res.status(200).json(items);
});
