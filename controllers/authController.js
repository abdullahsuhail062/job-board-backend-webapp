// controllers/authController.js (or wherever you handle auth)
import { findUserByEmail, findUserByUsername, createUser } from '../services/authUserService.js';


import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/generateToken.js'; // ✅ Import your token util
import {validateRegisterUser} from '../validators/authValidator.js'

const prisma = new PrismaClient();


// 🚀 Register User
export const registerUser = async (req, res) => {
  let databaseErrors ={}
  const {username, email, password} = req.body.myData
  try {
   databaseErrors = validateRegisterUser(req.body.myData);


    

    
    

  if (Object.keys(databaseErrors).length > 0) {
    return res.status(400).json({databaseErrors});
  }

     // Use services to check database
     if (await findUserByUsername(username)) {
        databaseErrors.username = 'Username already exists';
      }
      if (await findUserByEmail(email)) {
        databaseErrors.email = 'Email already exists';
      }
  
      if (Object.keys(databaseErrors).length > 0) {
        return res.status(409).json({databaseErrors}); // 409 Conflict
      }

      const newUser = await createUser({ username, email, password });
      
      
      
  
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
    const { email, password } = req.body.myData;
    console.log(email)

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
      console.log(message)
    return res.json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
