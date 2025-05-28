import express from 'express';
const router = express.Router();

import { loginUser, registerUser, fetchUserProfile } from "../controllers/authController.js";

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.get('/fetchUserProfile/:id', fetchUserProfile)

export default router; 
