import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBRipple,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";
import { propTypesDisabled } from "@material-tailwind/react/types/components/accordion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  const [userId, setUserId] = React.useState(null);

  const goto = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      goto("/login");
      return;
    }

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
  }, []);

  const addToCart = async () => {
    console.log("Add to cart clicked");

    console.log("User ID:", userId);
    console.log("Item ID:", id);

    try {
      const response = await axios.post("http://localhost:5000/api/addItem", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        userId: userId,
        itemId: id,
      });

      console.log("Response:", response);

      if (response.data.message === "Item already in cart") {
        toast.success("Item already in cart");
        return;
      }

      if (response.status === 200) {
        toast.success("Item added to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/product/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    getProductById();
  }, [id]);

  useEffect(() => {
    const getSellerName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getSellerName?productId=${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setSellerName(response.data.sellerName);
      } catch (error) {
        console.error("Error fetching seller name:", error);
        setError("Failed to load seller name");
      }
    };

    getSellerName();
  }, [id]);

  if (loading) {
    return (
      <MDBContainer
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      >
        <h3>Loading...</h3>
      </MDBContainer>
    );
  }

  console.log("Product:", product);

  if (product.isSold) {
    return (
      <MDBContainer
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      >
        <h3>This product is sold out</h3>
      </MDBContainer>
    );
  }

  if (error) {
    return (
      <MDBContainer
        fluid
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
      >
        <h3>{error}</h3>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer fluid className="min-vh-100 d-flex bg-light mt-5">
      <MDBRow className="w-100 justify-content-center">
        <MDBCol md="10" xl="8">
          <MDBCard className="shadow-lg border rounded-4 overflow-hidden">
            <MDBRow className="g-0">
              <MDBCol md="6" className="d-flex align-items-center">
                <MDBRipple
                  rippleColor="light"
                  rippleTag="div"
                  className="bg-image hover-zoom w-100"
                >
                  <MDBCardImage
                    src={product.photo || "https://via.placeholder.com/600"}
                    fluid
                    className="w-100 h-100 object-fit-cover rounded-start"
                  />
                </MDBRipple>
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="p-5 d-flex flex-column justify-content-between h-100">
                  <div>
                    <h2 className="fw-bold text-dark mb-3">{product.name}</h2>
                    <p className="text-muted mb-2">
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p className="text-muted mb-4">
                      <strong>Description:</strong> {product.description}
                    </p>
                    <div className="d-flex align-items-center mb-4">
                      <h3 className="fw-bold text-primary me-2">
                        ₹{product.price}
                      </h3>
                    </div>
                    <h5 className="md-8">Seller Name : {sellerName}</h5>
                    <h6 className="text-success fw-bold">
                      Free shipping (only for IIIT)
                    </h6>
                  </div>
                  <div className="d-flex flex-column mt-4">
                    <button
                      type="button"
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
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ProductPage;
