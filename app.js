import express from 'express'
const app = express();
const port = 3000;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });
import bodyParser from 'body-parser';
import cors from 'cors';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-CSRF-Token', 'X-Requested-With', 'Content-Type', 'Authorization'],
  credentials: true
}));
app.use(cors({
  origin: 'https://job-board-webapp.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If using cookies/auth
}));


app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' https://job-board-backend-webapp.vercel.app; script-src 'self'; style-src 'self'");
  next();
});


import { neon } from '@neondatabase/serverless';
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);


app.post('/api/registerUser', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const dataBaseValidationErrors = {};

    // Check if username already exists
    const resultUsername = await sql`SELECT username FROM users WHERE username = ${username}`;
    if (resultUsername.length > 0) {
      dataBaseValidationErrors.usernameExist = 'Username already exists';
    }

    // Check if email already exists
    const resultEmail = await sql`SELECT email FROM users WHERE email = ${email}`;
    if (resultEmail.length > 0) {
      dataBaseValidationErrors.userEmailExist = 'Email already exists';
    }

    // If username or email exists, return error response
    if (Object.keys(dataBaseValidationErrors).length > 0) {
      return res.status(401).json(dataBaseValidationErrors);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const insertResult = await sql`
      INSERT INTO users (username, email, password) 
      VALUES (${username}, ${email}, ${hashedPassword}) 
      RETURNING id, username, email`;

      const newUser = insertResult[0]  // ✅ Correct way to access the inserted user
    console.log(newUser);
    
    
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      console.log('Generated token:', token);
      
      // Return response
      return res.status(201).json({
        message: 'User registered successfully',
        token,
      });
      
      } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
app.post('/api/loginUser', async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = {};

    // Find user by email
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];  // ✅ Corrected

    // If no user found, return error
    if (!user) {
      return res.status(400).json({ email: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ password: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  
  if (!authHeader) {
    console.log('No token provided');
    
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.id 
              // Extract user ID from token
    next();
  } catch (error) {
    console.log('Invalid or expired token');
    
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Authentication Middleware
function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.user = {id:decoded.id}; // Attach the user object to `req`
    console.log(req.user.id);
    
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token'});
  }
}




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});