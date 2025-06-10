// controllers/authController.js (or wherever you handle auth)
<<<<<<< HEAD
import { findUserByEmail, findUserByUsername, createUser, updateUserProfileData } from '../services/authUserService.js';
=======
import { findUserByEmail, findUserByUsername, createUser, updateUserProfileDpData, deleteAccountById } from '../services/authUserService.js';
>>>>>>> 3356ba3 (Fresh start)


import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/generateToken.js'; // ✅ Import your token util
import {validateRegisterUser} from '../validators/authValidator.js'
<<<<<<< HEAD

const prisma = new PrismaClient();

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.usrId; // note: header keys are case-insensitive
    const { username, avatar } = req.body;
    

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided in headers.' });
    }

    const updatedUser = await updateUserProfileData(userId,{username, avatar})
      

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    console.log(message, user,"logging object");
    
=======
import {  authenticateUser } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();
export const updateUserProfileDp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar, username } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided in URL.' });
    }

    if (!avatar && !username) {
      return res.status(400).json({ error: 'No update data provided.' });
    }

    const updatedUserDp = await updateUserProfileDpData(userId, { avatar, username });

    if (!updatedUserDp) {
      return res.status(404).json({ error: 'User not found or update failed.' });
    }

    const newToken = generateToken({
      id: updatedUserDp.id,
      username: updatedUserDp.name, avatar: updatedUserDp.avatar
    });
    


    return res.status(200).json({ message: 'Profile updated successfully', user: newToken });

>>>>>>> 3356ba3 (Fresh start)
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


<<<<<<< HEAD
=======


>>>>>>> 3356ba3 (Fresh start)
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
      
      
      
<<<<<<< HEAD
=======
      
>>>>>>> 3356ba3 (Fresh start)
  
      const token = generateToken({ id: newUser.id, email: newUser.email, username: newUser.name });
  
      return res.status(201).json({
        message: 'User registered successfully',
        token,
      });
<<<<<<< HEAD
=======
      
>>>>>>> 3356ba3 (Fresh start)
  
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
 

<<<<<<< HEAD
// 🚀 Login User
=======
// 🚀 Login User    console.log("Generated token:", newToken);

>>>>>>> 3356ba3 (Fresh start)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.myData;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
<<<<<<< HEAD
=======
    
>>>>>>> 3356ba3 (Fresh start)

    if (!user) {
      return res.status(400).json({ email: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ password: 'Invalid email or password' });
    }

    // ✅ Use the imported generateToken
<<<<<<< HEAD
    const token = generateToken({ id: user.id, email: user.email, username: user.name });
=======
    const token = generateToken({ id: user.id, email: user.email, username: user.name, avatar: user.avatar });
    
>>>>>>> 3356ba3 (Fresh start)
    
    
    return res.json({ message: 'Login successful', token});

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }

};

 export const fetchUserProfile = async (req, res) => {
<<<<<<< HEAD
  const userId = parseInt(req.params.id); // or from req.user.id if using auth
=======
  const userId = req.user.id // or from req.user.id if using auth
>>>>>>> 3356ba3 (Fresh start)

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

<<<<<<< HEAD
=======
export const deleteAccount = async (req, res) => {

  const userId = req.user.id
  


try {

    if (!userId) {
      return res.status(400).json({ error: 'User ID not provided in URL.' });
    }
      await deleteAccountById(userId)

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
}





>>>>>>> 3356ba3 (Fresh start)

