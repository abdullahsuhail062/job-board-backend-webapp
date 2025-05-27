import express from 'express';
const router = express.Router();

import { loginUser, registerUser } from "../controllers/authController.js";

router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);

export default router; 
