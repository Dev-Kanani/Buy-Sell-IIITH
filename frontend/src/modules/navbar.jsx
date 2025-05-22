import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import SearchBasicExample from "./searchbar";
import ProfilePage from "../components/profile";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function NavScrollExample() {
  const goto = useNavigate();

  const logout = async () => {
    const token = localStorage.getItem("token");

    // Clear local storage before logout
    localStorage.removeItem("token");

    // Call backend logout (optional but recommended)


    // Redirect the user to CAS logout, and then bring them back to home page
    const casLogoutUrl = `https://login.iiit.ac.in/cas/logout?service=${encodeURIComponent("http://localhost:5173/login")}`;

    if (token) {
      await axios.post("http://localhost:5000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch(err => console.error("Backend logout failed:", err));
    }
    
    window.location.href = casLogoutUrl; // Redirect to CAS logout

  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Buy/Sell @ IIITH</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link onClick={() => goto("/search")}>Search Items</Nav.Link>
            <Nav.Link onClick={() => goto("/orderHistory")}>
              Order History
            </Nav.Link>
            <Nav.Link onClick={() => goto("/deliverItem")}>
              Deliver Items
            </Nav.Link>
            <Nav.Link onClick={() => goto("/chatbot")}>
              Chat with us
            </Nav.Link>
          </Nav>

          <Nav className="" style={{ maxHeight: "100px" }} navbarScroll>
            <Nav.Link onClick={() => goto("/sell")}>Sell</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Button variant="outline-success" onClick={() => goto("/cart")}>
              Cart
            </Button>
          </Form>
          <NavDropdown
            title="Profile"
            id="navbarScrollingDropdown"
            className="ms-4"
          >
            <NavDropdown.Item onClick={() => goto("/profile")}>
              Info
            </NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
