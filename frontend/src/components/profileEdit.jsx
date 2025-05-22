import React, { useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import axios from "axios";
import { InputDefault } from "../modules/input";

import { useNavigate } from "react-router-dom";

import { MDBInput } from "mdb-react-ui-kit";

export default function EditProfile() {
  const [user, setUser] = React.useState(null);
  const goto = useNavigate();
  const [email, setEmail] = React.useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      goto("/login");
      return;
    }

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

      console.log("User:", user);
    }
  }, []);

  useEffect(() => {
    console.log("Email:", email);
    if (email)
      axios
        .get(`http://localhost:5000/api/getUser?email=${email}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then((response) => {
          setUser(response.data); 
        })
        .catch((error) => console.error(error));
  }, [email]); 

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEdit = async (e) => {
    if (
      !user.contactNumber ||
      !user.firstName ||
      !user.lastName ||
      !user.email ||
      !user.age ||
      !user.password
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (user.password[0] === '$') {
      alert("Enter password");
      return;
    }


    if (user.contactNumber.length !== 10) {
      alert("Contact number should be of 10 digits");
      return;
    }

    if (!user.password) {
      alert("Please enter your password");
      return;
    }

    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:5000/api/updateUser",
        user,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      console.log("User updated:", response.data);

      alert("User updated successfully");
      goto("/profile");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>Profile</MDBBreadcrumbItem>
              <MDBBreadcrumbItem>Info</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
                <hr />
                <form onSubmit={handleEdit}>
                  <div className="d-flex justify-content-center mb-2">
                    <button
                      type="submit"
                      style={{
                        display: "inline-block",
                        width: "20%",
                        padding: "10px",
                        fontSize: "16px",
                        color: "white",
                        backgroundColor: "blue",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>FirstName</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>LastName</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email (Not editable)</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="email"
                      value={user.email}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Age</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="age"
                      value={user.age}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>ContactNo.</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBInput
                      name="contactNumber"
                      value={user.contactNumber}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Password (if dont want to change input your correct password otherwise the changed password)</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      <MDBInput
                        name="password"
                        onChange={handleChange}
                        required
                      />
                    </MDBCardText>
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
