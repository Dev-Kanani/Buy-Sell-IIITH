import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";
import { useNavigate,useSearchParams } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [catcha, setCatcha] = useState("");

  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   console.log("Token:", token);

  //   if (token) {
  //     axios
  //       .get("http://localhost:5000/api/currentUser", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         console.log("User data:", response.data);
  //         console.log("Email:", response.data.email);
  //         setEmail(response.data.email);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user data:", error);
  //       });

  //     window.location.href = "/profile";

  //     console.log("User:", user);
  //   }
  //   if (!token) {
  //     window.location.href = "/login";
  //     return;
  //   }
  // }, [loading]);


  const goto = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      goto('/profile');
    }
  }, [searchParams, goto]);

  useEffect(() => {
    const token_in_memory = localStorage.getItem("token");

    if (token_in_memory) {
      goto("/profile"); 
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); 

    if (!email) {
      alert("Please enter email");
      window.location.reload();
      return;
    }
    if (!password) {
      alert("Please enter password");
      window.location.reload();
      return;
    }
    if (!catcha) {
      alert("Please complete the captcha");
      window.location.reload();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email: email,
        password: password,
        recaptcha: catcha,
      });

      if (response.status === 200) {
        alert("Login successful!");
        console.log(response.data.token);
        localStorage.setItem("token", response.data.token);
        goto("/profile");
      } else {
        alert("Login failed. Please try again.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Invalid credentials. If you don't have an account, please sign up.");
      window.location.reload();
    }
  };

  const handleCASLogin = async () => {
    const serviceURL = `http://localhost:5000/api/cas-callback`;

    const casLoginURL = `https://login.iiit.ac.in/cas/login?service=${encodeURIComponent(serviceURL)}`;

    window.location.href = casLoginURL;
  };

  return (
    <MDBContainer fluid className="p-4">
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            The silliest of<br />
            <span className="text-primary">things are sold here</span>
          </h1>
          <p className="px-3" style={{ color: "hsl(217, 10%, 50.8%)" }}>
            Discover the quirkiest and most unique items that you won't find anywhere else. Shop now and add a touch of whimsy to your life!
          </p>
        </MDBCol>
        <MDBCol md="5">
          <MDBCard className="my-5">
            <MDBCardBody className="p-5">
              <h2 className="text-center mb-4">Login</h2>

              <MDBInput
                wrapperClass="mb-4"
                label="Email"
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              <ReCAPTCHA
                sitekey="6LetF8QqAAAAAPVLqjH00Kwk7AgbQzTElphTBEWc"
                onChange={(value) => setCatcha(value)}
                style={{ width: "50%" }}
              />

              <button
                type="submit"
                style={{
                  display: "inline-block",
                  width: "100%",
                  padding: "10px",
                  fontSize: "16px",
                  color: "white",
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleLogin}
              >
                Login
              </button>

              <p className="text-center mt-3">
                Don't have an account?
                <button
                  onClick={() => goto("/signup")}
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
                  Sign Up
                </button>
              </p>

              <button
                onClick={handleCASLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login with CAS
              </button>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
