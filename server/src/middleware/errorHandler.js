/**
 * 404 Route Not Found Middleware
 */
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let errorName = 'Internal Server Error';
  let message = err.message || 'An unexpected error occurred on the server';

  // Handle Mongoose CastError (e.g. invalid ObjectId during queries)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorName = 'Cast Error';
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose Schema ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorName = 'Validation Error';
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join('; ');
  }

  res.status(statusCode).json({
    success: false,
    error: errorName,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
