# PlaceHub — University Placement Portal

PlaceHub is a full-stack web application designed to simplify the university placement process.
It allows students to explore job opportunities, apply to companies, and track their application status while giving administrators tools to manage job postings and applicants efficiently.

This project was built as part of an academic project to simulate a real-world campus placement system.

---

## Live Demo

Frontend
https://placehub.me

Backend API
https://placehub-backend-3ft5.onrender.com

---

## Overview

PlaceHub connects students with placement opportunities in a structured way..

Students can:

* Create an account using their university email
* Complete their profile
* Upload resumes
* Browse and apply for jobs
* Track application status

Administrators can:

* Post and manage job listings
* Review applicants
* Update application status
* Monitor placement analytics

The goal is to provide a simple, centralized platform for campus recruitment.

---

## Features

### Student Features

* University email registration with OTP verification
* Profile creation with academic details
* Resume upload (PDF only)
* Browse available job postings
* Save jobs for later
* Apply for jobs with profile validation
* Track application status in real time
* Receive email updates when status changes

### Admin Features

* Admin dashboard with analytics
* Create, edit, and delete job postings
* View all applicants across jobs
* Update application status (Pending / Shortlisted / Selected / Rejected)
* Email notifications sent to students when status changes

---

## Security Features

* Password hashing using bcrypt
* JWT authentication
* Secure httpOnly cookies
* CORS protection
* Rate limiting on authentication routes
* Input validation using express-validator
* File upload restrictions (PDF only)
* OTP expiration and single-use verification

---

## Tech Stack

Frontend
React
Vite
TailwindCSS

Backend
Node.js
Express.js

Database
MongoDB Atlas

Authentication
JWT + bcrypt

File Storage
Cloudinary

Email Service
Resend

Deployment
Vercel (Frontend)
Render (Backend)

---

## Project Structure

```
PlaceHub
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── context
│   ├── index.html
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
└── README.md
```

---

## Getting Started (Local Setup)

### Prerequisites

Make sure you have installed:

Node.js
MongoDB Atlas account
Cloudinary account
Resend email API

---

### Clone the Repository

```
git clone https://github.com/SaiHariKrishna/PlaceHub
cd placehub
```

---

### Backend Setup

Navigate to the server folder:

```
cd server
npm install
```

Create a `.env` file inside the server directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=PlaceHub <noreply@yourdomain.com>
```

Start the backend server:

```
npm run dev
```

---

### Frontend Setup

Open another terminal and go to the client folder:

```
cd client
npm install
```

Create a `.env` file inside the client directory:

```
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```
npm run dev
```

The app should now run at:

```
http://localhost:5173
```

---

## Deployment

Frontend is deployed on Vercel.
Backend is deployed on Render.

Environment variables must be configured on both platforms.

Frontend environment variable:

```
VITE_API_URL=https://placehub-backend-3ft5.onrender.com
```

Backend environment variable:

```
CLIENT_URL=https://placehub.me
```

---

## Future Improvements

* Interview scheduling module
* Resume AI feedback
* Job recommendation engine
* Notification system
* Company dashboards
* Advanced analytics for placements

---

## Author

Konda Venkata Sai Hari Krishna
Computer Science Engineering Student

---

## License

This project was built for educational purposes and academic demonstration.
