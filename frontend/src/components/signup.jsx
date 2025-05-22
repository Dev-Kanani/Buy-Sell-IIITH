import React, { useState } from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const goto = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !age || !contactNumber) {
      alert("All fields are required");
      return;
    }

    if (contactNumber.length !== 10) {
      alert("Contact number should be of 10 digits");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      age,
      contactNumber,
    };

    console.log("User data:", userData);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/signup",
        userData
      );

      if (response.data.message === "Email already exists!") {
        toast.error("Email already exists");
        return;
      }

      if (response.data.message === "All fields are required") {
        alert("All fields are required");
        return;
      }

      if (response.data.message === "User already exists") {
        alert("User already exists");
        return;
      }

      if (response.data.message === "Please use your IIIT email id") {
        // alert("Please use your IIIT email id");
        toast.error()
        return;
      }

      console.log(response.data);
      alert("Signup successful!");

      goto("/profile");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <MDBContainer fluid className="p">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            The best offer <br />
            <span className="text-primary">for your business</span>
          </h1>

          <p className="px-3" style={{ color: "hsl(217, 10%, 50.8%)" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </MDBCol>

        <MDBCol md="5">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="First name"
                    id="form1"
                    type="text"
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </MDBCol>

                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Last name"
                    id="form1"
                    type="text"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </MDBCol>
              </MDBRow>

              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                id="form1"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form1"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <MDBRow>
                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Age"
                    id="form1"
                    type="text"
                    required
                    onChange={(e) => setAge(e.target.value)}
                  />
                </MDBCol>

                <MDBCol col="6">
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Contact No."
                    id="form1"
                    type="text"
                    required
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </MDBCol>
              </MDBRow>

              <button
                type="submit"
                style={{
                  display: "inline-block",
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  color: "white",
                  backgroundColor: "blue",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleSignup}
              >
                Signup
              </button>

              <p className="text-center mt-3">
                Already have an account?
                <button
                  onClick={() => goto("/login")}
                  style={{
                    marginLeft: "5px",
                    color: "#007bff",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </button>
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
