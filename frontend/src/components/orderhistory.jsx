import React, { useEffect, useState } from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCardImage,
} from "mdb-react-ui-kit";
import axios from "axios";

import toast from "react-hot-toast";

import DeliverItemInOrderHistory from "./deliveriteminorderhistory";

import ReviewModal from "../modules/reviewcard.jsx";
import { Button } from "react-bootstrap";

const regenerateOtp = async (itemId) => {
  console.log("Regenerating OTP for item:", itemId);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/regenerateOtp",
      { itemId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    console.log("OTP regenerated:", response.data);
    const newOtp = response.data.otp;
    toast.success("OTP regenerated successfully: " + newOtp);
  } catch (error) {
    console.error("Error regenerating OTP:", error);
  }
};

export const OrderHistory = () => {
  const [myid, setMyid] = useState("");
  const [allItemsBuyed, setAllItemsBuyed] = useState([]);
  const [itemsDetails, setItemsDetails] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://localhost:5000/api/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("User data:", response.data);
        setMyid(response.data.userId);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  useEffect(() => {
    if (!myid) return;

    console.log("Fetching orders for user:", myid);

    axios
      .get("http://localhost:5000/api/getMyBuyedOrders", {
        params: { userId: myid }, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("Orders fetched:", response.data);
        setAllItemsBuyed(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [myid]);

  useEffect(() => {
    if (allItemsBuyed.length === 0) return;

    const fetchItemDetails = async () => {
      try {
        const updatedItemsDetails = await Promise.all(
          allItemsBuyed.map(async (order) => {
            console.log("Fetching item data for order:", order);
            const response = await axios.get(
              "http://localhost:5000/api/getItemData",
              {
                params: { productId: order.itemId },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );
            console.log("Item data fetched:", response.data);
            console.log("Item id fetched:", response.data._id);
            return {
              ...order,
              _id: order.itemId,
              itemName: response.data.name,
              photo: response.data.photo,
            };
          })
        );

        setItemsDetails(updatedItemsDetails);
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchItemDetails();
  }, [allItemsBuyed]);

  console.log("Items details:", itemsDetails);

  const tableData = itemsDetails.map((item) => ({
    id: item._id,
    name: item.buyerName,
    itemName: item.itemName,
    photo: item.photo,
    amount: item.amount,
    status: item.orderStatus,
  }));

  console.log("Table data:", tableData);

  const handleReviewClick = (productId) => {
    setSelectedProductId(productId);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (myid) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getMyBuyedOrders",
          {
            params: { userId: myid },
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setAllItemsBuyed(response.data);
      } catch (error) {
        console.error("Error refreshing orders:", error);
      }
    }
  };

  const DisplayTable = ({ data }) => {
    const uniqueData = data.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
    data = uniqueData;
    return (
      <MDBContainer
        className="py-4"
        style={{
          maxWidth: "90%",
          margin: "auto",
        }}
      >
        <h4 className="text-center fw-bold text-primary mb-4">Previous Orders</h4>

        <div
          style={{
            overflowX: "auto",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            backgroundColor: "#fff",
          }}
        >
          <MDBTable responsive striped bordered hover>
            <MDBTableHead className="bg-light">
              <tr>
                <th>Product Id</th>
                <th>Photo</th>
                <th>Item Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Regenerate Otp</th>
                <th>Review</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {data.map(({ id, name, itemName, photo, amount, status }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>
                    <MDBCardImage
                      src={photo}
                      alt="Product"
                      fluid
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                      }}
                    />
                  </td>
                  <td>{itemName}</td>
                  <td>{amount}</td>
                  <td>
                    <MDBBadge
                      color={
                        status === "Active"
                          ? "success"
                          : status === "Pending"
                            ? "warning"
                            : status === "Delivered"
                              ? "info"
                              : "danger"
                      }
                      pill
                      className="px-3 py-2"
                    >
                      {status}
                    </MDBBadge>
                  </td>
                  <td>
                    <Button color="primary" onClick={() => regenerateOtp(id)}>
                      Regenerate
                    </Button>
                  </td>
                  <td>
                    {status === "Delivered" && (
                      <Button
                        color="secondary"
                        onClick={() => handleReviewClick(id)}
                      >
                        Write Review
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </MDBContainer>
    );
  };


  return (
    <>
      <DisplayTable data={tableData} />
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        productId={selectedProductId}
      />
      <DeliverItemInOrderHistory />
    </>
  );
};

export default OrderHistory;
