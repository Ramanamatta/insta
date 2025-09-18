# Instagram Clone - MERN Stack

A full-stack Instagram clone built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication and profiles
- Post creation with image/video upload
- Real-time chat messaging
- Stories and Reels
- E-commerce functionality
- Order management
- Payment integration with Razorpay

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Real-time**: Socket.io
- **Payment**: Razorpay

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel with automatic deployments from the main branch.

### Backend (Render)
The backend is deployed on Render with environment variables configured.

## Environment Variables

### Backend
```
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
API_KEY=cloudinary_api_key
API_SECRET=cloudinary_api_secret
CLOUD_NAME=cloudinary_cloud_name
FRONTEND_URL=your_frontend_url
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend
```
VITE_API_URL=your_backend_url
```

## Local Development

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run both servers

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```