// middlewares/errorMiddleware.js

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error for debugging
  
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // hide stack in production
    });
  };
  