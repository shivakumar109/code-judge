import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './Config/db.js';
import commonRoutes from './APIs/commonAPI.js';
import userRoutes from './APIs/userAPI.js';
import adminRoutes from './APIs/adminAPI.js';
import seedDB  from './seed.js';

dotenv.config();

console.log("=========================================");
console.log("SERVER STARTUP ENVIRONMENT INFO:");
console.log("PORT =", process.env.PORT);
console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("JUDGE0_URL =", process.env.JUDGE0_URL);
console.log("=========================================");

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedDB();
    app.listen(PORT, () => {
      console.log('Server executing in development  mode on port ' + PORT);
    });
  } catch (error) {
    console.error(
      'Startup Error:',
      error.message
    );
  }
};

startServer();
// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'https://code-judge-platform.onrender.com'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, postman, or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Mapping
app.use('/api/common-api', commonRoutes);
app.use('/api/user-api', userRoutes);
app.use('/api/admin-api', adminRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Online Code Judge Backend' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected internal error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});