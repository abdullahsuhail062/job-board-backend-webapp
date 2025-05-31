// controllers/authController.js (or wherever you handle auth)
import { findUserByEmail, findUserByUsername, createUser, updateUserProfileData } from '../services/authUserService.js';


import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/generateToken.js'; // ✅ Import your token util
import {validateRegisterUser} from '../validators/authValidator.js'

const prisma = new PrismaClient();

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.headers.usrid; // note: header keys are case-insensitive
    const { username, avatar } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided in headers.' });
    }

    const updatedUser = await updateUserProfileData({username, avatar})
      

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


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
      
      
      
  
      const token = generateToken({ id: newUser.id, email: newUser.email, username: newUser.name });
  
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
    const token = generateToken({ id: user.id, email: user.email, username: user.name });
    
    
    return res.json({ message: 'Login successful', token});

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }

};

 export const fetchUserProfile = async (req, res) => {
  const userId = parseInt(req.params.id); // or from req.user.id if using auth

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true, // only fetch the email field (more efficient)
      
        // add other fields if needed
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


