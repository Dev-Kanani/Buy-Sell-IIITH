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

import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = React.useState(null);

  const [email, setEmail] = React.useState("");

  const goto = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

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
          setUser(response.data);
        })
        .catch((error) => console.error(error));
  }, [email]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const averageRating = user.sellerReviews.length > 0
    ? (user.sellerReviews.reduce((acc, review) => acc + review.star, 0) / user.sellerReviews.length).toFixed(1)
    : "No ratings yet";

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
                {/* <form onSubmit={handleEdit}></form> */}
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
                    onClick={() => goto("/profileEdit")}
                  >
                    Edit
                  </button>
                </div>
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
                    <MDBCardText className="text-muted">
                      {user.firstName}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>LastName</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {/* Johnatan Smith */}
                      {user.lastName}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {/* example@example.com */}
                      {user.email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Age</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {/* Johnatan Smith */}
                      {user.age}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>ContactNo.</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {user.contactNumber}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Password</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      ************
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow className="mb-4">
                  <MDBCol sm="12">
                    <h5 className="mb-0">Seller Reviews</h5>
                    <div className="mt-2">
                      <strong>Average Rating: </strong>
                      <span className="text-warning">
                        {typeof averageRating === 'number' && [...Array(5)].map((_, index) => (
                          <MDBIcon
                            key={index}
                            fas
                            icon="star"
                            className={index < Math.round(averageRating) ? "text-warning" : "text-muted"}
                          />
                        ))}
                        {' '}{averageRating}
                      </span>
                    </div>
                  </MDBCol>
                </MDBRow>

                {user.sellerReviews.length > 0 ? (
                  user.sellerReviews.map((review, index) => (
                    <MDBCard key={index} className="mb-3">
                      <MDBCardBody>
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-0">{review.reviewerName}</h6>
                          <h6>{review.productId}</h6>
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <MDBIcon
                                key={i}
                                fas
                                icon="star"
                                className={i < review.star ? "text-warning" : "text-muted"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 mb-0">{review.review}</p>
                      </MDBCardBody>
                    </MDBCard>
                  ))
                ) : (
                  <p className="text-muted">No reviews yet</p>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
