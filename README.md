# PlaceHub – University Placement & Career Portal

A full-stack MERN application built for Woxsen University students to discover placement opportunities, apply to jobs, and track application progress. Admins can manage job postings, review applicants, and monitor analytics.

---

## Features

### Student Portal
- **Registration with OTP verification** — only `_2027@woxsen.edu.in` emails accepted
- **Profile management** — name, age, branch, skills, CGPA, links, resume upload
- **Profile completion required** — students must fill age, branch, CGPA, and upload a resume before applying
- **Profile review modal** — review your full profile in a modal before confirming an application
- **Job browsing** — search, filter by company / location / type / skills
- **Job recommendations** — matched to student skills
- **Apply to jobs** — profile-validated applications with duplicate prevention
- **Save / bookmark jobs** — apply later
- **Application tracking** — real-time status updates (Pending → Shortlisted → Selected / Rejected)
- **Email notifications** — receive styled HTML emails when your application status changes

### Admin Portal
- **Enhanced dashboard analytics** — 5 stat cards (students, jobs, applications, shortlisted, rejected) + charts (Chart.js)
- **Job management** — create, edit, delete job postings
- **Applicant management** — view applicants per job, update status with email notifications
- **All Applicants page** — view and manage every application across all jobs, filter by status
- **Change password** — secure password change from admin settings
- **Pre-seeded credentials** — `admin@placehub.com` / `admin123`

### Security
- Passwords hashed with **bcrypt** (12 rounds)
- **JWT** authentication with 7-day expiry
- Tokens stored in **httpOnly secure cookies**
- **Helmet** security headers
- **Rate limiting** on auth routes
- **Input validation** with express-validator
- **File upload restrictions** — PDF only, 5 MB max
- **CORS** restricted to frontend origin
- **Role-based access control** (student / admin)
- **Data privacy** — students can only access own data
- **OTP expiry** (5 min) and single-use enforcement
- **Duplicate application prevention** via compound unique index

### UI / Design
- **Glassmorphism theme** — dark gradient background with frosted-glass cards, inputs, and buttons
- **Backdrop blur & transparency** — `bg-white/10`, `backdrop-blur-xl`, `border-white/20` across all components
- **Responsive design** — mobile-first layouts with adaptive grids and collapsible navigation
- **Custom utility classes** — `.glass`, `.glass-card`, `.glass-input`, `.glass-btn`, `.glass-btn-secondary`
- **Decorative elements** — animated gradient blur circles on key pages

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Frontend       | React 18, Vite, TailwindCSS (Glassmorphism UI) |
| Backend        | Node.js, Express.js               |
| Database       | MongoDB Atlas (Mongoose)           |
| Authentication | JWT + bcrypt                       |
| File Storage   | Cloudinary                         |
| Email          | Nodemailer (Gmail SMTP)            |
| Charts         | Chart.js + react-chartjs-2        |

---

## Project Structure

```
PlaceHub/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Navbar, Footer, JobCard, StatusBadge, ProfileReviewModal
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Student & admin pages
│   │   │   └── admin/         # Admin-only pages
│   │   ├── services/          # Axios API instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── server/                    # Express backend
│   ├── config/                # DB, Cloudinary, Email, Seed
│   ├── controllers/           # Auth, User, Job, Application, SavedJob, Admin
│   ├── middleware/             # Auth, Upload, Validators
│   ├── models/                # User, Job, Application, SavedJob
│   ├── routes/                # API route definitions
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Installation Guide

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)
- **Gmail account** with App Password enabled

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PlaceHub
```

### 2. Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free cluster.
2. Create a database user with a password.
3. Whitelist your IP (or allow from anywhere: `0.0.0.0/0`).
4. Copy your connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/placehub?retryWrites=true&w=majority
   ```

### 3. Setup Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/).
2. From the Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.

### 4. Setup Gmail App Password

1. Enable **2-Step Verification** on your Google account.
2. Go to [App Passwords](https://myaccount.google.com/apppasswords).
3. Generate a new app password for "Mail".
4. Copy the 16-character password.

### 5. Configure Environment Variables

**Backend** — create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/placehub?retryWrites=true&w=majority
JWT_SECRET=your_random_jwt_secret_at_least_32_chars
CLIENT_URL=http://localhost:5173
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

**Frontend** — create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 6. Install Dependencies & Run

```bash
# Install backend dependencies
cd server
npm install

# Start backend (runs on port 5000)
npm run dev
```

Open a new terminal:

```bash
# Install frontend dependencies
cd client
npm install

# Start frontend (runs on port 5173)
npm run dev
```

### 7. Access the App

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

### Default Admin Login

```
Email:    admin@placehub.com
Password: admin123
```

> The admin account is auto-created on first server start. Change the password in production.

---

## Database Collections

| Collection     | Description                      |
|----------------|----------------------------------|
| `users`        | Student & admin accounts         |
| `jobs`         | Job postings by admin            |
| `applications` | Student job applications         |
| `savedjobs`    | Bookmarked jobs per student      |

---

## API Endpoints

### Auth
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| POST   | `/api/auth/register`  | Register student      |
| POST   | `/api/auth/verify-otp`| Verify email OTP      |
| POST   | `/api/auth/login`     | Login                 |
| POST   | `/api/auth/logout`    | Logout                |
| GET    | `/api/auth/me`        | Get current user      |

### Users
| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/users/profile`  | Get own profile       |
| PUT    | `/api/users/profile`  | Update profile        |
| POST   | `/api/users/resume`   | Upload resume         |

### Jobs
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/jobs`               | List jobs (with filters)  |
| GET    | `/api/jobs/recommended`   | Skill-matched jobs        |
| GET    | `/api/jobs/:id`           | Get single job            |
| POST   | `/api/jobs`               | Create job (admin)        |
| PUT    | `/api/jobs/:id`           | Update job (admin)        |
| DELETE | `/api/jobs/:id`           | Delete job (admin)        |

### Applications
| Method | Endpoint                            | Description                |
|--------|-------------------------------------|----------------------------|
| POST   | `/api/applications/:jobId/apply`    | Apply to job               |
| GET    | `/api/applications/my`              | My applications            |
| GET    | `/api/applications/check/:jobId`    | Check if applied           |
| GET    | `/api/applications/admin/stats`     | Admin analytics            |
| GET    | `/api/applications/admin/job/:jobId`| Job applicants (admin)     |
| PUT    | `/api/applications/admin/:id/status`| Update status (admin)      |

### Saved Jobs
| Method | Endpoint                      | Description               |
|--------|-------------------------------|---------------------------|
| GET    | `/api/saved-jobs`             | Get saved jobs            |
| GET    | `/api/saved-jobs/check/:jobId`| Check if saved            |
| POST   | `/api/saved-jobs/:jobId`      | Save job                  |
| DELETE | `/api/saved-jobs/:jobId`      | Unsave job                |

### Admin
| Method | Endpoint                        | Description                     |
|--------|----------------------------------|---------------------------------|
| PUT    | `/api/admin/change-password`     | Change admin password           |
| GET    | `/api/admin/all-applicants`      | Get all applicants (admin)      |
| PUT    | `/api/admin/update-status`       | Update status + send email      |

---

## Deployment Guide

### Deploy Backend to Render

1. Push your code to GitHub.
2. Go to [Render](https://render.com/) → **New Web Service**.
3. Connect your GitHub repo, select the `server` directory as root.
4. **Build command:** `npm install`
5. **Start command:** `node server.js`
6. Add all environment variables from `server/.env` in the Render dashboard.
7. Set `CLIENT_URL` to your Vercel frontend URL (e.g., `https://placehub.vercel.app`).
8. Deploy.

### Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com/) → **New Project**.
2. Import your GitHub repo, set **Root Directory** to `client`.
3. **Framework Preset:** Vite
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Deploy.

### Post-Deployment

- Update `CLIENT_URL` in Render to match your Vercel domain.
- Update `VITE_API_URL` in Vercel to match your Render backend URL.
- Ensure MongoDB Atlas allows connections from Render's IP (or `0.0.0.0/0`).

---

## License

This project is built for educational purposes at Woxsen University.
