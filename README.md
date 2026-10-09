# CampusFind - Campus Lost and Found Management System

A Full Stack MERN (MongoDB, Express, React, Node.js) web application designed for college students to report and find lost items on campus.

## Objectives
- Allow students to quickly report lost or found items.
- Provide a searchable and filterable dashboard of all reported items.
- Ensure secure access so users can only manage their own reports.
- Act as a comprehensive learning project for Full Stack Development.

## Technology Stack
- **Frontend**: React.js with Vite, React Router DOM, Axios, Lucide React (icons), standard CSS3.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB ORM), JWT (JSON Web Tokens) for authentication, bcrypt for password hashing.
- **Database**: MongoDB Atlas.

## Features
- **User Authentication**: Secure signup and login with JWT and bcrypt.
- **Report Management**: Create, edit, and delete lost/found reports.
- **Status Tracking**: Mark reports as "Resolved" when items are returned.
- **Advanced Search & Filtering**: Filter items by category, type (lost/found), status (open/resolved), and text search.
- **Dashboard Stats**: Live statistics of reported items.
- **Responsive Design**: Modern UI that works well on desktop and mobile.

## Project Structure and Architecture
This project follows a standard Client-Server architecture.
1. The **Client** (React frontend) handles UI and sends HTTP requests using Axios to the server.
2. The **Server** (Express backend) provides REST APIs. It validates requests, applies authentication middleware, and interacts with the database using Mongoose.
3. The **Database** (MongoDB) stores Users and Items as BSON documents.

## Setup Instructions

### Prerequisites
- Node.js installed
- A MongoDB Atlas account and connection string (or a local MongoDB instance).

### 1. Database Configuration
1. Create a MongoDB Atlas cluster.
2. Create a database user and whitelist your IP address (or use `0.0.0.0/0` for development).
3. Get the connection string.

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory: `cd server`
2. Run `npm install`
3. Create a `.env` file in the `server` directory (you can copy `.env.example`).
4. Update `.env` with your actual MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=super_secret_key_123
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   
   # Cloudinary for Image Uploads
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Start the backend: `npm run dev` (Ensure you add `"dev": "nodemon server.js"` to `package.json` scripts, or just run `npx nodemon server.js`).

### 3. Frontend Setup
1. Open a *new* terminal and navigate to the `client` directory: `cd client`
2. Run `npm install`
3. The `.env` file is already set up to point to `http://localhost:5000/api`.
4. Start the frontend: `npm run dev`
5. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

---

## 15 FSD Lab Viva Questions & Answers

**1. What is the MERN stack?**
MERN stands for MongoDB, Express.js, React.js, and Node.js. It is a full-stack JavaScript framework for building dynamic web applications.

**2. How does React communicate with the Express backend?**
React uses HTTP clients like the native `Fetch API` or `Axios` to send asynchronous HTTP requests (GET, POST, PUT, DELETE) to the REST API endpoints exposed by the Express backend.

**3. What is the role of Node.js and Express.js?**
Node.js is a JavaScript runtime that allows JavaScript to run on the server. Express.js is a lightweight web framework for Node.js that simplifies routing, handling requests, and creating APIs.

**4. How do MongoDB and Mongoose work together?**
MongoDB is a NoSQL database that stores data in JSON-like documents. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data, handle validation, and interact with the database easily.

**5. What is a REST API?**
REST (Representational State Transfer) is an architectural style for APIs. It uses standard HTTP methods (GET, POST, PUT, DELETE) to perform CRUD (Create, Read, Update, Delete) operations on resources identified by URLs.

**6. How does JWT authentication work in this app?**
When a user logs in, the backend verifies their credentials and generates a JSON Web Token (JWT) signed with a secret key. The frontend stores this token (in localStorage) and sends it in the `Authorization` header of subsequent requests. The backend middleware verifies the token to authorize access to protected routes.

**7. Why do we hash passwords, and what library was used?**
Passwords are hashed using `bcrypt` so that even if the database is compromised, the plain text passwords remain secure. Hashing is a one-way mathematical function.

**8. What is the purpose of the `protect` middleware in the backend?**
The `protect` middleware intercepts incoming requests to protected routes. It checks for a valid JWT in the headers. If valid, it attaches the user to the `req` object and allows the request to proceed; otherwise, it returns a 401 Unauthorized error.

**9. How do frontend forms save data to the database?**
When a user submits a form, a React function prevents the default page reload, gathers the input state into a JavaScript object, and uses Axios to send a POST/PUT request to the backend. The Express controller receives `req.body`, validates it, and uses Mongoose (`Item.create()`) to save it to MongoDB.

**10. What is React Router used for?**
React Router enables client-side routing in single-page applications. It allows the app to change the URL and render different components without requesting a new HTML page from the server, making navigation fast.

**11. Explain the Context API (`AuthContext`) used in this project.**
The Context API provides a way to share data (like user login state and the auth token) across the entire component tree without having to pass props down manually at every level.

**12. How does the search and filter functionality work on the backend?**
The frontend sends search terms and filter categories as query parameters in the URL (e.g., `?type=lost&category=Books`). The Express controller extracts these from `req.query`, constructs a MongoDB query object using operators like `$regex` for text matching, and returns the filtered results.

**13. How did we ensure users can only delete their own reports?**
In the `deleteItem` controller, we fetch the item and check if `item.user.toString() === req.user.id`. If they don't match, the backend returns a 403 Forbidden error, preventing the deletion.

**14. What are Environment Variables (`.env`), and why are they important?**
Environment variables store configuration settings and sensitive information (like database connection strings and secret keys) outside the source code. This prevents secrets from being hardcoded and exposed in version control systems like GitHub.

**15. What is CORS and why is it needed here?**
CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers. Since our React frontend (port 5173) and Express backend (port 5000) run on different origins, the backend must use the `cors` middleware to explicitly allow the frontend to make requests to it.

---
*Developed for Full Stack Development Lab*
