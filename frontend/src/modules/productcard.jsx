import React, { useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBBtn,
  MDBRipple,
} from "mdb-react-ui-kit";
import axios from "axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

function ProductCard({ name, price, photo, category, id }) {
  const [userId, setUserId] = React.useState(null);

  const goto = useNavigate();

  const token = localStorage.getItem("token");

  if (token) {
    axios
      .get("http://localhost:5000/api/currentUser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserId(res.data.userId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const addToCart = async () => {
    console.log("Add to cart clicked");

    console.log("User ID:", userId);
    console.log("Item ID:", id);
    console.log("Token:", token);

    const response = await axios.post("http://localhost:5000/api/addItem", {
      headers: { Authorization: `Bearer ${token}` },
      userId: userId,
      itemId: id,
    });

    if (response.data.message === "Item already in cart") {
      toast.success("Item already in cart");
      return;
    }

    if (response.status === 200) {
      toast.success("Item added to cart");
    }

    // const response2 = await axios.post("http://localhost:5000/api/addItem?")
  };

  const imageUrl = photo.includes("example.com")
    ? "https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/12.webp"
    : photo;

  return (
    <MDBContainer fluid className="">
      <MDBRow className="justify-content-center ">
        <MDBCol md="15">
          <MDBCard
            style={{ borderRadius: "15px", height: "100%", cursor: "pointer" }}
          >
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom hover-shadow"
            >
              <MDBCardImage
                src={imageUrl}
                fluid
                className="w-100"
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  objectFit: "cover",
                  height: "200px",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Click to view more"
                onClick={() => goto(`/product/${id}`)}
              />
              <a href="#!">
                <div className="mask"></div>
              </a>
            </MDBRipple>
            <hr className="my-0" />

            <MDBCardBody
              className="pb-0"
              onClick={() => goto(`/product/${id}`)}
            >
              <div className="d-flex justify-content-between overflow-hidden text-overflow-ellipsis">
                <div>
                  <p className="text-truncate text-overflow-ellipsis">{name}</p>
                  <p className="small text-muted">{category}</p>
                </div>
                <div>
                  <div className="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                  </div>
                </div>
              </div>
            </MDBCardBody>
            <hr className="my-0" />
            <MDBCardBody className="pb-0">
              <div className="d-flex justify-content-between align-items-center pb-2 mb-4">
                <span>&#8377; {price}</span>
                <button
                  type="submit"
                  style={{
                    display: "inline-block",
                    width: "45%",
                    padding: "10px",
                    fontSize: "16px",
                    color: "white",
                    backgroundColor: "blue",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ProductCard;
