import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ControlledCheckbox from "./checkbox"; // Assuming you already have this component

const BasicButtonExample = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const addCategory = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  const removeCategory = (category) => {
    if (selectedCategories.includes(category)) {
      const removedList = selectedCategories.filter((item) => item !== category);
      setSelectedCategories(removedList);
    }
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/products/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="w-screen h-screen px-5 bg-gray-100 flex justify-center items-center">
      <div className="w-full h-[90%] rounded-md bg-white">
        <div className="relative w-full h-[15%] flex items-center overflow-x-auto">
          <DropdownButton
            id="dropdown-basic-button"
            title="Select Categories"
            variant="primary"
          >
            {categories.map((category, index) => (
              <Dropdown.Item
                key={index}
                as="button"
                className="d-flex justify-content-between align-items-center px-3 py-2"
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    removeCategory(category);
                  } else {
                    addCategory(category);
                  }
                }}
              >
                <span>{category.split("-").join(" ")}</span>
                <ControlledCheckbox checked={selectedCategories.includes(category)} />
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </div>
    </div>
  );
};

export default BasicButtonExample;
