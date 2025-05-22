import React, { useState, useEffect } from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBTextArea,
  MDBBtn,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { Button } from 'react-bootstrap';

const ReviewModal = ({ isOpen, onClose, onSubmit, productId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState("");

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
          setUser(response.data); // Set the user object directly
        })
        .catch((error) => console.error(error));
  }, [email]);

  const userName = user ? user.firstName : 'User';

  console.log("Username:", userName);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token:", token);
      console.log("Username:", userName);
      console.log("Rating:", rating);
      console.log("Review:", review);
      console.log("Product ID:", productId);
      
      const response = await axios.post(
        'http://localhost:5000/api/postReview',
        {
          userName,
          rating,
          review,
          productId
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Review submitted successfully!');
      onSubmit();
      onClose();
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  return (
    <MDBModal open={isOpen} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Write a Review</MDBModalTitle>
            <MDBBtn
              className='btn-close'
              color='none'
              onClick={onClose}
            />
          </MDBModalHeader>

          <MDBModalBody>
            <div className='d-flex justify-content-center align-items-center gap-2 mb-4'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className='btn btn-link p-0'
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <i
                    className={`fas fa-star ${star <= (hoveredRating || rating) ? 'text-warning' : 'text-muted'}`}
                    style={{ fontSize: '24px' }}
                  />
                </button>
              ))}
            </div>

            <MDBTextArea
              label='Your Review'
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </MDBModalBody>

          <MDBModalFooter>
            <MDBBtn
              color='secondary'
              onClick={onClose}
            >
              Cancel
            </MDBBtn>
            <Button
              onClick={handleSubmit}
              disabled={!rating || !review.trim()}
            >
              Submit Review
            </Button>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ReviewModal;