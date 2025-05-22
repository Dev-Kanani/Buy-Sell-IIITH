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

const DisplayTable = ({ data }) => {
  const DeliverItem = async ({ itemId, otp }) => {
    console.log("Delivering item:", itemId, otp);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/deliverItem",
        { itemId, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Deliver item response:", response.data);

      if (response.data.message === "Incorrect OTP") {
        console.log("Incorrect OTP");
        toast.error("Incorrect OTP", {
          style: {
            border: "1px solid #ff0000",
            padding: "16px",
            color: "#ff0000",
          },
          iconTheme: {
            primary: "#ff0000",
            secondary: "#FFFAEE",
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.reload();
        // alert("Incorrect OTP");

        return;
      }

      console.log("Deliver item response:", response.data);

      toast.success("Delivered Successfull", {
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
    } catch (error) {
      console.error("Error delivering item:", error);
    }
  };

  const [enteredOtp, setEnteredOtp] = useState("");

  return (
    <MDBContainer
      className="py-4"
      style={{
        maxWidth: "90%",
        margin: "auto",
      }}
    >
      <h4 className="text-center fw-bold text-primary mb-4">Delivery</h4>

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
              <th>Order Id</th>
              <th>Photo</th>
              <th>Item Name</th>
              <th>Buyer Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {data.map(
              ({ id, name, itemName, buyerName, photo, amount, status }) => (
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
                  <td>{buyerName}</td>
                  <td>{amount}</td>
                  <td>
                    <MDBBadge
                      color={
                        status === "Active"
                          ? "success"
                          : status === "Pending"
                            ? "warning"
                            : "danger"
                      }
                      pill
                      className="px-3 py-2"
                    >
                      {status}
                    </MDBBadge>
                  </td>
                  <td>
                    <MDBInput
                      type="text"
                      placeholder="Enter OTP"
                      size="sm"
                      onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        DeliverItem({ itemId: id, otp: enteredOtp })
                      }
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              )
            )}
          </MDBTableBody>
        </MDBTable>
      </div>
    </MDBContainer>
  );
};

export const DeliverItem = () => {
  const [myid, setMyid] = useState("");
  const [allItemsBuyed, setAllItemsBuyed] = useState([]);
  const [itemsDetails, setItemsDetails] = useState([]);

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
      .get("http://localhost:5000/api/getMyDeliverOrders", {
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
            const getUser = await axios.get(
              "http://localhost:5000/api/getBuyerName",
              {
                params: { productId: order.itemId },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );
            return {
              ...order,
              itemName: response.data.name,
              photo: response.data.photo,
              buyerName: getUser.data.buyerName,
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
    buyerName: item.buyerName,
    photo: item.photo,
    amount: item.amount,
    status: item.orderStatus,
  }));

  console.log("Table data:", tableData);

  const [allItemsIAmSelling, setAllItemsIAmSelling] = useState([]);
  const myUserId = myid;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getAllItemsIAmSelling?userId=${myUserId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAllItemsIAmSelling(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [myUserId]);

  console.log("Items I am selling:", allItemsIAmSelling);

  return (
    <>
      <DisplayTable data={tableData} />;
      {/* <div>
        <h4 className="text-center fw-bold text-primary mb-4">Items I Am Selling</h4>
        <ul>
          {allItemsIAmSelling.map((item) => (
            <li key={item._id}>
              {item.name} - {item.price}
            </li>
          ))}
        </ul>
      </div>
    <div> */}
      <h4 className="text-center fw-bold text-primary mb-4">Items I Am Selling</h4>
      <MDBTable responsive striped bordered hover>
        <MDBTableHead className="bg-light">
          <tr>
            <th>Name</th>
            <th>Photo</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Is Sold</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {allItemsIAmSelling.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <MDBCardImage
                  src={item.photo}
                  alt="Product"
                  fluid
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                  }}
                />
              </td>
              <td>{item.price}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>
                <MDBBadge
                  color={item.isSold ? "success" : "danger"}
                  pill
                  className="px-3 py-2"
                >
                  {item.isSold ? "Sold" : "Available"}
                </MDBBadge>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </>
  );
};

export default DeliverItem;
