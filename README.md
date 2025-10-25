# 📱 Social Media Backend API

A full-featured **Social Media Backend Application** built with **NestJS** and **MongoDB**, providing a real-time social experience — including authentication, friends, posts, comments, private chats, notifications, and media uploads through Cloudinary.  

---

## 🚀 Overview

This project is a backend for a social media platform that allows users to connect, share content, and communicate in real-time.  
It’s designed using a **modular architecture** with **NestJS**, ensuring scalability, maintainability, and clean separation of concerns.  

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | **NestJS** |
| Database | **MongoDB + Mongoose** |
| Authentication | **JWT (JSON Web Token)** |
| Real-time Communication | **WebSocket (NestJS Gateway)** |
| File Storage | **Cloudinary** |
| Validation | **class-validator / class-transformer** |
| Env Config | **dotenv** |

---

## 🧩 Modules Description

### 🔐 Auth Module
Handles the **authentication and authorization** logic.  
- User registration & login  
- Password encryption using bcrypt  
- JWT-based authentication  
- Guards & decorators for protecting routes  

---

### 👤 User Module
Manages **user data and profiles**.  
- Retrieve all users or a specific user  
- Update profile info and avatars (via Cloudinary)  
- Manage user privacy and account details  

---

### 📝 Post Module
Responsible for **creating, updating, and managing user posts**.  
- CRUD operations for posts  
- Upload images or videos using Cloudinary  
- React to posts (like, love, haha, etc.)  
- Real-time updates for reactions and new posts  

---

### 💬 Comment Module
Enables **user interaction through comments**.  
- Add, edit, or delete comments  
- Reply to other comments  
- Nested comment structure  
- Real-time updates when new comments are added  

---

### 🤝 Friend Module
Implements **social connection features**.  
- Send, accept, and reject friend requests  
- Cancel sent requests or unfriend users  
- Retrieve friends and pending requests  
- Real-time notifications on friend request actions  

---

### 💭 Conversation Module
Handles **real-time private messaging** between users.  
- Create conversations  
- Send, edit, or delete messages  
- Mark messages as seen  
- Real-time delivery and seen status via WebSocket  

---

### ☁️ Cloudinary Module
Integrates **Cloudinary** for file and image storage.  
- Upload profile pictures, post media, and message attachments  
- Retrieve public URLs and metadata  
- Centralized media handling across modules  

---

### 🔔 Notification Module
Manages **real-time notifications** across the app.  
- Trigger notifications for messages, comments, and friend requests  
- Deliver instantly using WebSockets  
- Fetch notification history for users  

---

## ⚙️ Run the Project

To run this project locally, follow these steps 👇  

### 1️⃣ Clone the repository
```bash
git clone https://github.com/MahmoudElokaily/Social-media-app
cd social-media-app
2️⃣ Install dependencies
pnpm install
3️⃣ Create .env file
Before running the project, create a .env file in the root directory.
This file contains the environment variables required for the app to function.

Copy and paste the following into your .env file:

# MongoDB Configuration
MONGO_HOST=
MONGO_DB=
MONGO_USER=
MONGO_PASS=

# Server Port
PORT=

# Cloudinary Configuration
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# JWT Configuration
JWT_SECRET=
JWT_EXPIRATION=
⚠️ Make sure to fill in these values with your own credentials before starting the server.

4️⃣ Start the application
pnpm run start:dev
Your app should now be running at:
👉 http://localhost:5000

🧪 Test the API
Import the included Postman Collection to test all endpoints:
social media.postman_collection.json

⚡ Real-Time Features
Instant message delivery

Live typing indicators

Seen/unseen message status

Real-time notifications for reactions, messages, and requests

🚀 Future Enhancements
Group chats

Online/offline presence indicators

Pagination and search filters

Push notifications integration
```
## 👨‍💻 Author
Mahmoud El-Okaily
Software Engineer | Backend Developer (NestJS / Node.js)
📞 Phone: +20 10 1553 1345  
🔗 LinkedIn: www.linkedin.com/in/mahmoud-elokaily1
💻 GitHub: https://github.com/MahmoudElokaily
