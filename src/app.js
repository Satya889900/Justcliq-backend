import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import { ApiError } from './utils/ApiError.js';
import path from "path";

// Import Routes from src
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';

import serviceOrderRoutes from "./routes/serviceOrder.routes.js";

dotenv.config();
const app = express();
// console.log("🚀 ~  process.env.CORS_ORIGIN:",  process.env.CORS_ORIGIN)

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || [
        'http://localhost:3000',
        
        'http://localhost:8000',
  
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `${process.env.MONGODB_URI}`,
      collectionName: 'sessions',
      ttl: 60 * 60, // 1 hour session expiry
      autoRemove: 'native',
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);


// Routes
app.use("/api/serviceOrder", serviceOrderRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
// Serve uploaded images
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Categories API for users

// Services API for users


// ✅ Products API for users

//booking service by users


 // ✅ Add this line



// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'JustClick Backend API working 🚀' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      data: err.data,
      errors: err.errors,
      timestamp: err.timestamp,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      data: null,
      errors: [err.message],
      timestamp: new Date().toISOString(),
    });
  }
});

export { app };