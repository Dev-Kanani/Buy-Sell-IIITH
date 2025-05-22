import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import NavScrollExample from "./modules/navbar";
import { AuthContext } from "./components/authentication";
import ProfilePage from "./components/profile";
import SearchItem from "./components/search";
import EditProfile from "./components/profileEdit";
import Cart from "./components/cart";
import { Sell } from "./components/sell";
import { useNavigate } from "react-router-dom";
import ProductPage from "./components/productpage";
import OrderHistory from "./components/orderhistory";
import DeliverItem from "./components/deliveritem";
import { Toaster } from "react-hot-toast";
import ChatBot from "./components/chatbot";
function App() {
  const { isLoggedIn } = useContext(AuthContext); // Correct usage

  return (
    <>
      <NavScrollExample /> {/* Navbar always visible */}
      <Toaster position="top-middle" duration={3000} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <ProfilePage /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchItem />} />
        <Route path="/profileEdit" element={<EditProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/orderHistory" element={<OrderHistory />} />
        <Route path="/deliverItem" element={<DeliverItem />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </>
  );
}

export default App;
