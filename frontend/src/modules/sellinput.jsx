import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";

export function SellCard() {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const [email, setEmail] = useState("");
  const [sellerId, setSellerId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);

    if (token) {
      axios
        .get("http://localhost:5000/api/currentUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("User data:", response.data);
          console.log("Email:", response.data.email);
          setEmail(response.data.email);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }

    if (!token) {
      window.location.href = "/login";
      return;
    }
  }, []);

  useEffect(() => {
    console.log("Email:", email);
    if (email)
      axios
        .get(`http://localhost:5000/api/getUser?email=${email}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((response) => {
          setSellerId(response.data._id); // Set the user object directly
        })
        .catch((error) => console.error(error));
  }, [email]);

  const addProduct = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (price < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    const productData = {
      name: productName,
      price: parseFloat(price), // Ensure price is a number
      description,
      category,
      photo: image, // If storing image as a URL
      sellerId,
    };

    console.log("Submitting:", productData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/sell",
        productData,
        {
          headers: { "Content-Type": "application/json" },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Product added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card style={{ width: "36rem" }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h4 className="mb-4 text-center">Add Product</h4>
          <Form onSubmit={addProduct}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" className="w-100 mt-3">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SellCard;
