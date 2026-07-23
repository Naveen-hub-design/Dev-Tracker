const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // MongoDB connection error
  if (err.name === 'MongoServerSelectionError' || err.message?.includes('MongooseError')) {
    return res.status(503).json({
      message: 'Database not connected. Please start MongoDB or check your MONGODB_URI.',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors).map((e) => e.message).join(', '),
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'A user with this email already exists',
    });
  }

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
