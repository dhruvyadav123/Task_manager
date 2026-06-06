# TaskFlow — MERN Task Management Application

A production-ready task management web application built with MongoDB, Express.js, React.js, Node.js, Tailwind CSS and JWT authentication.

## Features

- User registration and login
- JWT-based secure authentication
- Protected API routes
- Create, read, update and delete tasks
- Mark tasks as completed or pending
- Search tasks by title or description
- Filter by status
- Pagination
- Responsive dashboard
- Form validation and centralized error handling
- Secure headers, rate limiting and password hashing

## Tech Stack

### Frontend
- React + Vite
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- Lucide React
- React Hot Toast

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT
- bcryptjs
- Helmet
- CORS
- Express Rate Limit
- Morgan

## Project Structure

```text
mern-task-manager/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── utils/
│   └── ...
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── ...
└── package.json
```

## Setup Instructions

### 1. Clone repository

```bash
git clone <your-repository-url>
cd mern-task-manager
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Configure environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start application

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle`

## Query Parameters

```text
GET /api/tasks?search=design&status=pending&page=1&limit=8
```

## Deployment

- Frontend: Vercel or Netlify
- Backend: Render, Railway or VPS
- Database: MongoDB Atlas

Set production environment variables and update `CLIENT_URL` and `VITE_API_URL`.

### Deploy backend on Render

This repository now includes a root-level `render.yaml` for the backend web service.

1. Push the repository to GitHub.
2. In Render, click `New +` -> `Blueprint`.
3. Connect the repository and select the root `render.yaml`.
4. When prompted, provide values for:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
5. Deploy the Blueprint.

Render service settings defined in `render.yaml`:

- Runtime: `node`
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Recommended production values:

- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: long random secret
- `CLIENT_URL`: your deployed frontend URL, for example `https://taskflow.vercel.app`
- `JWT_EXPIRES_IN`: `7d`

After the backend is live, update the frontend environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

If the frontend is deployed on Vercel, also set the backend Render environment variable:

```env
CLIENT_URL=https://task-manager-xi-self.vercel.app
```

You can provide multiple allowed frontend origins by separating them with commas:

```env
CLIENT_URL=http://localhost:5173,https://task-manager-xi-self.vercel.app
```

## Assignment Submission Checklist

- Push project to GitHub
- Add deployed links to this README
- Add screenshots in a `screenshots` folder
- Record a short demo video
- Submit repository link by email

## Suggested Email Subject

`MERN Stack Assignment Submission – Your Name`
