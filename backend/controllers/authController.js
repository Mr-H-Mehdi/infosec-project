import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { sendOTPEmail } from '../utils/otpService.js';  // A utility function for sending OTP
import { generateOTP } from '../utils/otpGenerator.js';  // A utility function for generating OTP

// Regex to detect potential malicious scripts or SQL injection attempts
const maliciousInputRegex = /(<([^>]+)>|--|;|\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b|\/\*|\*\/|eval\(|<script|<\/script>)/i;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                    // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

const validateLoginInput = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const login = [
  validateLoginInput,
  loginLimiter,  // Apply rate limiting to login endpoint
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if email or password contains potentially malicious input
    if (maliciousInputRegex.test(email) || maliciousInputRegex.test(password)) {
      return res.status(400).json({ message: 'Suspicious activity detected. Please contact the helpline for assistance.' });
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }

      // Generate an OTP and send it to the user's email
      const otp = generateOTP();
      await sendOTPEmail(user.email, otp);  // Send OTP to the user's email

      // Store OTP in the session or database temporarily for verification
      user.otp = otp; 
      await user.save();

      // Send response asking for OTP
      res.status(200).json({
        message: 'OTP sent to your email. Please enter the OTP to complete login.',
        user: {
          email: user.email,
          username: user.username,
        },
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error during login. Please try again.' });
    }
  },
];

// Handle OTP verification
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Create JWT token after OTP is verified
    const payload = {
      userId: user._id,
      email: user.email,
    };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env file");
      process.exit(1);  // Exit if JWT_SECRET is not defined
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Clear OTP after verification
    user.otp = null;
    await user.save();

    // Return success response with JWT token
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        username: user.username,
      },
      token,  // Send token as part of response
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP. Please try again.' });
  }
};
