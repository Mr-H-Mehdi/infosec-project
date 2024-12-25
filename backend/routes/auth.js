import { Router } from 'express';
import { login, verifyOTP, web3Login } from '../controllers/authController.js';
import handler from './generate-credentials.js';

const router = Router();

// Define your login and OTP verification routes
router.post('/login', login);
router.post('/verify-otp', verifyOTP);  // Ensure this route is defined
router.post('/generate-credentials', handler);  // Ensure this route is defined
router.post('/web3-login', web3Login);  // New route for Web3 login
export default router;
