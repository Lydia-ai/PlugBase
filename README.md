# PlugBase Backend

PlugBase is a campus marketplace backend API designed to help students buy, sell, and request items within their university community. It provides the core services needed for a marketplace platform, including authentication, listings, requests, messaging, notifications, and user interactions.

##  Features

### Authentication & Users

* User registration and login
* JWT-based authentication
* Protected routes
* User profile management

### Marketplace

* Create, update, and manage listings
* Browse available products
* Search marketplace items
* Upload listing images

### Requests & Interests

* Users can request unavailable items
* Sellers can receive item interest notifications
* Automated request and listing management

### Communication

* Real-time messaging between users
* Conversation management using Socket.IO

### User Engagement

* Favorite listings
* Listing reviews
* Seller reviews
* Notifications

---

## 🛠 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO

### Authentication & Security

* JSON Web Tokens (JWT)
* Middleware-based route protection
* Request validation

### Other Services

* Cloudinary (image storage)
* Git & GitHub
* Postman (API testing)

---

## 📂 Project Structure

```
plugbase-backend/
│
├── config/          # Database and service configuration
├── controllers/     # Application logic
├── middleware/      # Authentication and error handling
├── models/          # MongoDB schemas
├── routes/          # API endpoints
├── socket/          # Real-time communication
├── validators/      # Input validation
├── server.js        # Backend entry point
└── package.json
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Lydia-ai/PlugBase.git
```

Navigate into the project folder:

```bash
cd PlugBase
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
npm start
```

---

## 🔌 API Modules

 Module        | Description                                 
 ------------- | ------------------------------------------- 
 Auth          | User registration and authentication        
 Listings      | Product creation and marketplace management 
 Requests      | Item requests and matching                  
 Messages      | Real-time user communication                
 Notifications | User activity alerts                        
 Reviews       | Listing and seller feedback                 
 Favorites     | Saved marketplace items                     
 Profiles      | User information management                 


## 👩🏽‍💻 Author

Oreoluwa Ojikutu

Computer Science Student | Software Engineering Enthusiast | Problem Solver

GitHub: https://github.com/Lydia-ai


## Live API

https://plugbase-1.onrender.com
