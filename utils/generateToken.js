// utils/token.js

import jwt from 'jsonwebtoken';

// Function to generate a JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Optionally, you could also add a function to verify token if needed
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
