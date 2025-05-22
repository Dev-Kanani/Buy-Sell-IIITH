import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SearchBasicExample({ handleSearch }) {
  const [searchTerm, setSearchTerm] = useState(""); // To track the input value

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    handleSearch(searchTerm); // Trigger the search based on the search term
  };

  return (
    <Form className="d-flex" onSubmit={handleSearchSubmit}>
      {" "}
      {/* Handle form submission */}
      <Form.Control
        type="search"
        placeholder="Type Here"
        className="me-4"
        aria-label="Search"
        value={searchTerm} // Bind the search term state to the input field
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term on input change
      />
      <Button
        variant="outline-success"
        type="submit" // Trigger form submission on button click
      >
        Search
      </Button>
    </Form>
  );
}

export default SearchBasicExample;
