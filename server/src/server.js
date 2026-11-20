import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware configuration
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint (Includes MongoDB connection state)
app.get('/api/health', (req, res) => {
  const dbStateCode = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    message: 'SpendWise API is running smoothly',
    database: dbStates[dbStateCode] || 'unknown',
    databaseConnected: dbStateCode === 1,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root welcoming route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the SpendWise API. Check GET /api/health for system status.',
    endpoints: {
      health: 'GET /api/health',
      expenses: 'GET /api/expenses',
      expenseSummary: 'GET /api/expenses/summary',
      expenseById: 'GET /api/expenses/:id',
      createExpense: 'POST /api/expenses',
      updateExpense: 'PUT /api/expenses/:id',
      deleteExpense: 'DELETE /api/expenses/:id',
    },
  });
});

// Mount Expense Routes
app.use('/api/expenses', expenseRoutes);

// 404 Route Handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

// Only listen and connect when run directly (not during unit testing import)
const isDirectExecution = process.argv[1] && (
  process.argv[1].endsWith('server.js') ||
  process.argv[1].endsWith('server')
);

if (isDirectExecution && process.env.NODE_ENV !== 'test') {
  connectDB();

  app.listen(PORT, () => {
    console.log(`[SpendWise Server] Running on http://localhost:${PORT}`);
    console.log(`[SpendWise Server] Health check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;
