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
                        border: "1px solid #4caf50",
                        padding: "16px",

                        color: "#4caf50",
                    },
                    iconTheme: {
                        primary: "#4caf50",
                        secondary: "#FFFAEE",
                    },
                });

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
                            <th>Item Name</th>
                            <th>Photo</th>
                            <th>Product Id</th>
                            <th>Buyer Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {data.map(
                            ({ id, name, itemName, buyerName, photo, amount, status }) => (
                                <tr key={id}>
                                    <td>{itemName}</td>
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
                                    <td>{id}</td>
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
                                </tr>
                            )
                        )}
                    </MDBTableBody>
                </MDBTable>
            </div>
        </MDBContainer>
    );
};

export const DeliverItemInOrderHistory = () => {
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

    return (
        <>
            <DisplayTable data={tableData} />;
        </>
    );
};

export default DeliverItemInOrderHistory;
