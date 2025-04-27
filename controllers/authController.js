// controllers/authController.js (or wherever you handle auth)

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/token.js'; // ✅ Import your token util

const prisma = new PrismaClient();



// 🚀 Register User
export const registerUser = async (req, res) => {
  try {
    const errors = validateRegisterUser(req.body.myData);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

     // Use services to check database
     if (await isUsernameTaken(username)) {
        errors.username = 'Username already exists';
      }
      if (await isEmailTaken(email)) {
        errors.email = 'Email already exists';
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(409).json(errors); // 409 Conflict
      }
  
      // Create user using services
      const hashedPassword = await hashPassword(password);
      const newUser = await createUser({ username, email, hashedPassword });
  
      const token = generateToken({ id: newUser.id, email: newUser.email });
  
      return res.status(201).json({
        message: 'User registered successfully',
        token,
      });
  
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

// 🚀 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ email: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ password: 'Invalid email or password' });
    }

    // ✅ Use the imported generateToken
    const token = generateToken({ id: user.id, email: user.email });

    return res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
