import express from 'express';
const router = express.Router();

import { loginUser, registerUser, fetchUserProfile, updateUserProfile } from "../controllers/authController.js";

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.get('/fetchUserProfile/:id', fetchUserProfile);
router.patch('/updateUserProfile/:usrId', updateUserProfile)

export default router; 
