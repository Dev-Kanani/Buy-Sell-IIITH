# Buy-Sell @ IIITH

This project is a Buy-Sell platform designed exclusively for the IIIT Community, built using the MERN stack (MongoDB, Express.js, React, Node.js). The platform enables users to register as both buyers and sellers, providing features for managing products, orders, cart, and a secure authentication system.

## Features:
- **User Registration/Login**: Secure authentication with hashed passwords (using bcrypt.js) and session management via JWT tokens.
- **Search and Filter**: Items can be searched and filtered based on categories.
- **Item Management**: Sellers can add and manage items. Buyers can view and add items to their cart.
- **Order History**: Tracks all orders placed and sold by users with OTP verification for transactions.
- **Cart Management**: Users can manage their cart, and place orders which are reflected in the order history.
- **Support ChatBot**: Integrated AI-powered chatbot for user queries (Bonus Feature).

## Technologies Used:
- **Frontend**: React-based framework, many UI/online UI
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Security**: JWT, bcrypt.js
- **Additional Features**: Google Recaptcha, CASLogin

## Assumptions

- For a single product multiple reviews can be added.
- No quantity is added for the item as in iiit we only have a single thing to sell at a single time.
- My package.json and node modules for the backend during the building of the website part, were outside the backend folder. But due to the submission format i had to put them inside the backend folder. So pls during testing drag the packages outside for proper working.

## Record

- mongodb+srv://devjkanani:dev_kanani@cluster0.uqu1c.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0

### Add .env in backend

MONGO_URI=mongodb+srv://devjkanani:ycKZ3bJy3dm8B52h@cluster0dass.pigcf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0DASS

JWT_SECRET=1613

GEMINI_API_KEY=AIzaSyANz5zi7e_6stibZMJdz2zvrj0h36B3R2M

FRONTEND_URL=http://localhost:5000
