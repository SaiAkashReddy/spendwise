import mongoose from 'mongoose';

/**
 * Middleware that ensures MongoDB is connected before attempting any database operations.
 * If disconnected, returns 503 Service Unavailable with a clear error message.
 */
export const checkDbConnection = (req, res, next) => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      error: 'Database Unavailable',
      message: 'The MongoDB database is currently disconnected. Please verify that MongoDB is running and MONGO_URI is configured correctly.',
    });
  }
  next();
};
