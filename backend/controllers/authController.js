import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Import User model
import rateLimit from 'express-rate-limit'; // Rate limiting library
import { body, validationResult } from 'express-validator'; // Input validation library

// Rate limiting middleware to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

// Input validation middleware
const validateLoginInput = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Login Controller
export const login = [
  validateLoginInput,
  loginLimiter, // Apply rate limiting to the login endpoint
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create a JWT token (with expiration and secret)
      const payload = {
        userId: user._id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // If password matches, return success response with JWT token
      res.status(200).json({
        message: 'Login successful',
        user: {
          email: user.email,
          username: user.username,
        },
        token, // Send token as part of response
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login. Please try again.' });
    }
  },
];
