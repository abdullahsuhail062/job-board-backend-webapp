import { Router } from "express"
import express from 'express';


const router = express.Router();
import { loginUser, registerUser } from "../controllers/authController";
router.post('/registerUser', registerUser)
router.post('/loginUser',loginUser)
