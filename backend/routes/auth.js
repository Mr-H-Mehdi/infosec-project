import express from 'express';
import { login } from '../controllers/authController.js'; // Import your login controller

const router = express.Router();

// Login Route - POST request to /api/login
router.post('/login', login);

export default router;
