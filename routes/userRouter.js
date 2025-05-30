import express from 'express';
const router = express.Router();

import { loginUser, registerUser, fetchUserProfile } from "../controllers/authController.js";
import { updateUserProfile } from '../services/authUserService.js';

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.get('/fetchUserProfile/:id', fetchUserProfile);
router.put('/updateUserProfile', updateUserProfile)

export default router; 
