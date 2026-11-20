import mongoose from 'mongoose';

/**
 * Sanitizes a MongoDB URI to safely mask credentials before logging.
 * Example: mongodb+srv://user:secret@cluster0... -> mongodb+srv://user:****@cluster0...
 */
export const sanitizeMongoUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
};

/**
 * Checks if the current Mongoose connection is ready.
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Connects to MongoDB using Mongoose with timeout and graceful error handling.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('[SpendWise DB] Warning: Neither MONGO_URI nor MONGODB_URI is defined in environment variables.');
    return false;
  }

  const safeUri = sanitizeMongoUri(mongoUri);

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds instead of hanging for 30s
    });

    console.log(`[SpendWise DB] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[SpendWise DB] Initial connection error (${safeUri}): ${error.message}`);
    return false;
  }
};

// Global MongoDB connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('[SpendWise DB] Disconnected from MongoDB');
});

mongoose.connection.on('reconnected', () => {
  console.log('[SpendWise DB] Reconnected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`[SpendWise DB] Runtime error: ${err.message}`);
});
