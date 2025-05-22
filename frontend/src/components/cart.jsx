import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { set } from "mongoose";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Cart2() {
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [itemId, setItemId] = useState();

  const goto = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.get(
            "http://localhost:5000/api/currentUser",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("User Response:", response.data);
          setUserId(response.data.userId);
        }
        if (!token) {
          window.location.href = "/login";
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return; 

    const requestFull = `http://localhost:5000/api/getCartItems?userId=${userId}`;
    console.log("Request Full:", requestFull);

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(requestFull, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    const flag = false;

    const removeSoldItems = async () => {
      console.log("all cart items:", cartItems);

      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].isSold === true) {
          // itemId = cartItems[i]._id;
          setItemId(cartItems[i]._id);
          console.log("Item ID:", cartItems[i]._id);
          removeFromCart();
          flag = true;
        }
      }
    };

    removeSoldItems();

    if (flag === true) {
      window.location.reload();
    }
  }, [cartItems]);

  console.log("Cart Items:", cartItems);

  const calculateTotal = () => {
    let total = 0;

    for (let i = 0; i < cartItems.length; i++) {
      total += cartItems[i].price;
    }

    return total;
  };

  const removeFromCart = async () => {
    console.log("Remove from cart");

    console.log("User ID:", userId);
    console.log("Item ID:", itemId);

    const response = await axios.post(
      "http://localhost:5000/api/removeItemFromCart",
      { userId: userId, itemId: itemId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );


    toast.success("Item removed from cart", {
      style: {
        border: "1px solid #4caf50",
        padding: "16px",
        color: "#4caf50",
      },
      iconTheme: {
        primary: "#4caf50",
        secondary: "#FFFAEE",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    window.location.reload();
  };

  useEffect(() => {
    if (itemId) {
      removeFromCart();
    }
  }, [itemId]);

  const handleCheckout = async () => {
    console.log("Checkout");

    const orders = [];

    for (let i = 0; i < cartItems.length; i++) {
      const randomOtpString = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const order = {
        buyerId: userId,
        sellerId: cartItems[i].sellerId,
        amount: cartItems[i].price,
        otp: randomOtpString,
        itemId: cartItems[i]._id,
      };

      orders.push(order);
    }

    console.log("Orders:", orders);

    for (let i = 0; i < orders.length; i++) {
      const response = await axios.post(
        "http://localhost:5000/api/checkout",
        orders[i],
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Checkout Response:", response.data);
    }

    toast.success("Checkout Successfull", {
      style: {
        border: "1px solid #4caf50",
        padding: "16px",
        color: "#4caf50",
      },
      iconTheme: {
        primary: "#4caf50",
        secondary: "#FFFAEE",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    window.location.reload();
  };

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol size="12">
            <MDBCard
              className="card-registration"
              style={{ borderRadius: "15px" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow className="g-0">
                  <MDBCol lg="8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <MDBTypography
                          tag="h1"
                          className="fw-bold mb-0 text-black"
                        >
                          Shopping Cart
                        </MDBTypography>
                        <MDBTypography className="mb-0 text-muted">
                          {cartItems.length} items
                        </MDBTypography>
                      </div>
                      <hr className="my-4" />
                      {cartItems.map((item, index) => (
                        <div key={index}>
                          <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                            <MDBCol md="2">
                              <MDBCardImage
                                src={item.photo}
                                fluid
                                className="rounded-3"
                              />
                            </MDBCol>
                            <MDBCol md="5">
                              <MDBTypography tag="h6" className="text-black">
                                {item.name}
                              </MDBTypography>
                              <MDBTypography>
                                <br />
                              </MDBTypography>
                              <MDBTypography
                                tag="h6"
                                className="text-muted mb-0 text-justify"
                              >
                                {item.description}
                              </MDBTypography>
                            </MDBCol>
                            <MDBCol md="1" className="text-end">
                              <button
                                className="btn btn-link me-2"
                                onClick={() => {
                                  setItemId(item._id);
                                }}
                              >
                                <MDBIcon fas icon="trash" />
                              </button>
                            </MDBCol>
                            <MDBCol md="3" className="text-end">
                              <MDBTypography tag="h6" className="mb-0">
                                ₹{item.price}
                              </MDBTypography>
                            </MDBCol>
                          </MDBRow>
                          <hr className="my-4" />
                        </div>
                      ))}
                      <div className="pt-5">
                        <MDBTypography tag="h6" className="mb-0">
                          <a href="#" className="text-body">
                            <MDBIcon fas icon="long-arrow-alt-left me-2" /> Back
                            to shop
                          </a>
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol lg="4" className="bg-grey">
                    <div className="p-5">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-5 mt-2 pt-1"
                      >
                        Summary
                      </MDBTypography>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between mb-4"></div>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between mb-5">
                        <MDBTypography tag="h5" className="text-uppercase">
                          Total price
                        </MDBTypography>
                        <MDBTypography tag="h5">
                          ₹{calculateTotal()}
                        </MDBTypography>
                      </div>
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={handleCheckout}
                      >
                        Checkout
                      </button>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
