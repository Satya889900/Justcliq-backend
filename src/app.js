import express from 'express';
import cors from 'cors';
import mainRouter from "./routes/user.routes.js ";

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
app.use(mainRouter);  // ✅ THIS WAS MISSING – THIS FIXES EVERYTHING

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



// import express from 'express';
// import cors from 'cors';

// import cookieParser from 'cookie-parser';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
// import dotenv from 'dotenv';
// import { ApiError } from './utils/ApiError.js';
// import path from "path";

// // Import Routes from src
// import adminRoutes from './routes/admin.routes.js';
// import userRoutes from './routes/user.routes.js';

// import serviceOrderRoutes from "./routes/serviceOrder.routes.js";

// dotenv.config();
// const app = express();
// // console.log("🚀 ~  process.env.CORS_ORIGIN:",  process.env.CORS_ORIGIN)

// // CORS Configuration
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()) || [
//         'http://localhost:3000',
        
//         'http://localhost:8000',
  
//       ];
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );

// // Middleware
// app.use(express.json({ limit: '16kb' }));
// app.use(express.urlencoded({ extended: true, limit: '16kb' }));
// app.use(cookieParser());
// app.use(express.static('public'));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// // Session Management
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: `${process.env.MONGODB_URI}`,
//       collectionName: 'sessions',
//       ttl: 60 * 60, // 1 hour session expiry
//       autoRemove: 'native',
//     }),
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'None',
//       maxAge: 60 * 60 * 1000, // 1 hour
//     },
//   })
// );


// // Routes
// app.use("/api/serviceOrder", serviceOrderRoutes);
// app.use('/admin', adminRoutes);
// app.use('/user', userRoutes);
// // Serve uploaded images
// // app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// // Categories API for users

// // Services API for users


// // ✅ Products API for users

// //booking service by users


//  // ✅ Add this line



// // Test Route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'JustClick Backend API working 🚀' });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   if (err instanceof ApiError) {
//     res.status(err.statusCode).json({
//       success: err.success,
//       message: err.message,
//       data: err.data,
//       errors: err.errors,
//       timestamp: err.timestamp,
//     });
//   } else {
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error',
//       data: null,
//       errors: [err.message],
//       timestamp: new Date().toISOString(),
//     });
//   }
// });

// export { app };




// import express from "express";
// import cors from "cors";

// import cookieParser from "cookie-parser";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import dotenv from "dotenv";
// import { ApiError } from "./utils/ApiError.js";
// import path from "path";

// // Import Routes from src
// import adminRoutes from "./routes/admin.routes.js";
// import userRoutes from "./routes/user.routes.js";

// import serviceOrderRoutes from "./routes/serviceOrder.routes.js";

// dotenv.config();
// const app = express();
// // console.log("🚀 ~  process.env.CORS_ORIGIN:",  process.env.CORS_ORIGIN)

// // CORS Configuration
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "http://localhost:3000",
//         "http://localhost:8000",

//         // Live Server (VS Code)
//         "http://127.0.0.1:5500",
//         "http://localhost:5500",

        
//         // For your HTML file
//         "http://127.0.0.1:62440",
//         "http://127.0.0.1:62440/",
        
//         // Extra safe options
//         "http://127.0.0.1",
//         "null",
//         null
//       ];

//       console.log("Incoming Origin:", origin);

//       if (!origin || allowedOrigins.includes(origin)) {
//         console.log("✅ ALLOWED ORIGIN:", origin)
//         callback(null, true);
//       } else {
//         console.log("🚫 BLOCKED ORIGIN:", origin);
//         callback(new Error("Not allowed by CORS"), false);
//       }
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );


// // Middleware
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());
// app.use(express.static("public"));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// // Session Management
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: `${process.env.MONGODB_URI}`,
//       collectionName: "sessions",
//       ttl: 60 * 60, // 1 hour session expiry
//       autoRemove: "native",
//     }),
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//       maxAge: 60 * 60 * 1000, // 1 hour
//     },
//   })
// );

// // Routes
// app.use("/api/serviceOrder", serviceOrderRoutes);
// app.use("/admin", adminRoutes);
// app.use("/user", userRoutes);
// // Serve uploaded images
// // app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// // Categories API for users

// // Services API for users

// // ✅ Products API for users

// //booking service by users

// // ✅ Add this line

// // Test Route
// app.get("/api/test", (req, res) => {
//   res.json({ message: "JustClick Backend API working 🚀" });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//   if (err instanceof ApiError) {
//     res.status(err.statusCode).json({
//       success: err.success,
//       message: err.message,
//       data: err.data,
//       errors: err.errors,
//       timestamp: err.timestamp,
//     });
//   } else {
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       data: null,
//       errors: [err.message],
//       timestamp: new Date().toISOString(),
//     });
//   }
// });

// export { app };


// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import dotenv from "dotenv";
// import path from "path";

// import adminRoutes from "../src/routes/user.routes.js";
// import userRoutes from "../src/routes/admin.routes.js";
// import serviceOrderRoutes from "../src/routes/serviceOrder.routes.js";
// import { ApiError } from "../src/utils/ApiError.js";


// dotenv.config();
// const app = express();

// /* -----------------------------------------
//    ✅ UNIVERSAL CORS (WORKS FOR LOGIN + RAZORPAY + HTML FILE)
// ------------------------------------------ */
// const allowedOrigins = [
//   "http://localhost:3000",     // React Frontend
//   "http://localhost:5173",     // Vite Frontend
//   "http://localhost:8000",     // Backend itself
//   "http://127.0.0.1:5500",     // VSCode Live Server
//   "http://localhost:5500",     // Additional Live Server
//   "http://127.0.0.1:62440",    // Your test Razorpay HTML
//   "http://127.0.0.1",          // Generic local
//   null                         // Postman / mobile etc.
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("Incoming Origin:", origin);

//       if (!origin || allowedOrigins.includes(origin)) {
//         console.log("✅ Allowed:", origin);
//         callback(null, true);
//       } else {
//         console.log("❌ Blocked:", origin);
//         callback(new Error("Not allowed by CORS"), false);
//       }
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// /* -----------------------------------------
//    Middleware
// ------------------------------------------ */
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());
// app.use(express.static("public"));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// /* -----------------------------------------
//    Session Management
// ------------------------------------------ */
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       collectionName: "sessions",
//       ttl: 60 * 60,
//     }),
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "None",
//       maxAge: 60 * 60 * 1000,
//     },
//   })
// );

// /* -----------------------------------------
//    Routes
// ------------------------------------------ */
// app.use("/api/serviceOrder", serviceOrderRoutes);
// app.use("/admin", adminRoutes);
// app.use("/user", userRoutes);

// /* -----------------------------------------
//    Test Route
// ------------------------------------------ */
// app.get("/api/test", (req, res) => {
//   res.json({ message: "JustClick Backend API working 🚀" });
// });

// /* -----------------------------------------
//    Global Error Handler
// ------------------------------------------ */
// app.use((err, req, res, next) => {
//   if (err instanceof ApiError) {
//     return res.status(err.statusCode).json({
//       success: err.success,
//       message: err.message,
//       data: err.data,
//       errors: err.errors,
//       timestamp: err.timestamp,
//     });
//   }

//   console.log("🔥 SERVER ERROR:", err.message);

//   res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//     errors: [err.message],
//     timestamp: new Date().toISOString(),
//   });
// });

// export { app };
