import express from 'express'
const app = express();
const port = 3000;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.development.local' });
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from '../..db';

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
function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specify the allowed origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

}



app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' https://job-board-backend-webapp.vercel.app; script-src 'self'; style-src 'self'");
  next();
});



function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  }
  
  
app.post('/api/registerUser', async (req, res) => {
  try {
    const sql = await connectDB()
    const { username, email, password } = req.body.myData;
    
    const credentialValidationError = {}
    const dataBaseValidationErrors = {};
    if (!username||username.length<3 ) {
        credentialValidationError.usernameLength = 'Username must be at least 3 characters long'
        return credentialValidationError
    }

    if (!email ) {
        credentialValidationError.invalidEmail = 'Please provide a valid email address'
        return credentialValidationError
    }



    if (!isStrongPassword(password)) {
        credentialValidationError.weakPassword = 'A strong password is required';
        return credentialValidationError;
      }
      

    // Check if username already exists
    const resultUsername = await sql`SELECT username FROM users WHERE username = ${username}`;
    if (resultUsername.length > 0) {
      dataBaseValidationErrors.usernameExist = 'Username already exists';
      return dataBaseValidationErrors

    }

    // Check if email already exists
    const resultEmail = await sql`SELECT email FROM users WHERE email = ${email}`;
    if (resultEmail.length > 0) {
      dataBaseValidationErrors.userEmailExist = 'Email already exists';
      return dataBaseValidationErrors
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

      const newUser = insertResult[0]  
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