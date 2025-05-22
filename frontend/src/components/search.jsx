import React, { useEffect, useLayoutEffect, useState } from "react";
import SearchBasicExample from "../modules/searchbar.jsx";
import ProductCard from "../modules/productcard.jsx";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import BasicButtonExample from "../modules/dropdown.jsx";
import axios, { all } from "axios";

import { Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

export default function SearchItem() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [tempoProducts, setTempoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ email: "", sellerId: "" });
  const [categories, setCategories] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);

  const goto = useNavigate();

  useEffect(() => {
    const initialise = async () => {
      try {
        setLoading(true);

        const response1 = await axios.get(
          "http://localhost:5000/api/searchAll", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const fetchedProducts = response1.data;
        setAllProducts(fetchedProducts);

        console.log("All products:", fetchedProducts);

        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response2 = await axios.get(
          "http://localhost:5000/api/currentUser",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const email = response2.data.email;
        console.log("User Email:", email);

        const response3 = await axios.get(
          `http://localhost:5000/api/getUser?email=${email}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const sellerId = response3.data._id;
        console.log("Seller ID:", sellerId);

        setUser({ email, sellerId });

        const tempProducts = [];

        for (let i = 0; i < fetchedProducts.length; i++) {
          if (fetchedProducts[i].sellerId !== sellerId) {
            // console.log(" Product Seller ID:", fetchedProducts[i].sellerId);

            tempProducts.push(fetchedProducts[i]);
          }
        }

        console.log("Temp products:", tempProducts);

        const temp2 = [];

        for (let i = 0; i < tempProducts.length; i++) {
          console.log("Checking for sold products:", tempProducts[i].name);
          if (tempProducts[i].isSold) {
            console.log("Product is sold:", tempProducts[i].name);
          } else {
            temp2.push(tempProducts[i]);
          }
        }

        console.log("Temp2:", temp2);

        setProducts(temp2);
        setTempoProducts(temp2);
        setAllProducts(temp2);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");

    if (!token) {
      goto("/login");
      return;
    }

    initialise();
  }, []);

  useEffect(() => {
    const tempCategories = [];
    const getCategories = async () => {
      for (let i = 0; i < allProducts.length; i++) {
        if (!tempCategories.includes(allProducts[i].category)) {
          tempCategories.push(allProducts[i].category);
        }
      }

      // setCategories(tempCategories);
      setTempCategories(tempCategories);
    };

    getCategories();
  }, [tempoProducts]);

  const handleSearch = (searchTerm) => {
    console.log("Search term:", searchTerm);

    let filteredProducts = tempoProducts;

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) => {
        const words = product.name.split(" ");
        return words.some((word) =>
          word.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      });
    }

    setProducts(filteredProducts);
  };

  const handleCategoryFilter = (nameOfCategory) => {
    console.log("Category:", nameOfCategory);

    console.log("Categories:", categories);

    const isSelected = categories.includes(nameOfCategory);

    // let updatedCategories;
    // if (isSelected) {
    //   // Remove category from the selected list
    //   updatedCategories = categories.filter(
    //     (category) => category !== nameOfCategory
    //   );
    // } else {
    //   // Add category to the selected list
    //   updatedCategories = [...categories, nameOfCategory];
    // }

    console.log("Is selected:", isSelected);

    let updatedCategories = [];

    if (isSelected) {
      updatedCategories = categories.filter(
        (category) => category !== nameOfCategory
      );
    } else {
      updatedCategories = [...categories, nameOfCategory];
    }

    setCategories(updatedCategories);

    console.log("Updated categories:", updatedCategories);

    let filteredProducts = allProducts;
    if (updatedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        updatedCategories.includes(product.category)
      );
    }

    if (filteredProducts.length === 0) {
      filteredProducts = tempoProducts;
    }

    setProducts(filteredProducts);
    setTempoProducts(filteredProducts);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MDBContainer>
      <div className="d-flex justify-content-center gap-3 my-4">
        <SearchBasicExample handleSearch={handleSearch} />
      </div>
      {/* <div className="d-flex justify-content-center gap-3 my-4">
        <table className="table table-bordered">
          <tbody>
            <tr>
              {tempCategories.map((category, index) => (
                <td key={index} className="text-center align-middle">
                  <div className="d-flex align-items-center justify-content-center">
                    <Checkbox onClick={() => handleCategoryFilter(category)} />
                    <span className="ms-2">{category}</span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div> */}
      <div className="container my-4">
        <div className="row justify-content-center">
          {tempCategories.map((category, index) => (
            <div
              key={index}
              className="col-6 col-sm-4 col-md-3 col-lg-2 text-center"
            >
              <div className="d-flex align-items-center justify-content-center">
                <Checkbox onClick={() => handleCategoryFilter(category)} />
                <span className="ms-2">{category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center my-4">
          <h5>No products found</h5>
        </div>
      )}

      <MDBRow className="g-4">
        {products.map((product) => (
          <MDBCol key={product._id} xs="12" sm="6" md="4" lg="3">
            <ProductCard
              name={product.name}
              price={product.price}
              photo={product.photo}
              category={product.category}
              id={product._id}
            />
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  );
}
