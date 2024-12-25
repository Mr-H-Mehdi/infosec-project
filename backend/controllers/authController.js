import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { sendOTPEmail, send2FATokenEmail } from '../utils/otpService.js';  // A utility function for sending OTP and 2FA tokens
import { generateOTP, generate2FAToken } from '../utils/otpGenerator.js';  // A utility function for generating OTP and 2FA tokens
import { getClientIp } from 'request-ip';  // To get the client's IP address for security validation
import { generateDeviceFingerprint } from '../utils/deviceFingerprint.js';  // Device fingerprinting utility

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

    const { email, password, deviceId } = req.body;  // Added deviceId for fingerprinting
    const clientIp = getClientIp(req);  // Capture the client's IP address
    console.log("Client IP: ", clientIp);  // Log the client's IP address
    console.log("Client deviceId: ", deviceId);  // Log the client's IP address

    // Check if email or password contains potentially malicious input
    if (maliciousInputRegex.test(email) || maliciousInputRegex.test(password)) {
      console.log("Malicious input detected in login request"); // Log malicious input detection
      return res.status(400).json({ message: 'Suspicious activity detected. Please contact the helpline for assistance.' });
    }

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      console.log("User found: ", user ? user.email : 'No user found'); // Log user information

      if (user == null) {
        console.log("Invalid login credentials: No matching user found."); // Log invalid credentials scenario
        return res.status(400).json({ message: 'Invalid login credentials' });
      }
      
      // Check if the device fingerprint matches (for added security)
      const deviceFingerprint = generateDeviceFingerprint(deviceId);
      console.log("Device fingerprint generated: ", deviceFingerprint); // Log device fingerprint
      console.log("User's device fingerprint: ", user.deviceFingerprint); // Log the user's stored device fingerprint

      
      if (deviceId!=undefined && deviceId != deviceFingerprint) {
        console.log("Device mismatch detected: Unrecognized device"); // Log device mismatch
        return res.status(400).json({ message: 'Unrecognized device. Please verify your identity.' });
      }
      if (user.deviceFingerprint != deviceFingerprint) {
        console.log("Device mismatch detected: Unrecognized device"); // Log device mismatch
        return res.status(400).json({ message: 'Unrecognized device. Please verify your identity.' });
      }

      // Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result: ", isMatch);  // Log password match result

      if (!isMatch) {
        console.log("Invalid login credentials: Password mismatch");  // Log password mismatch
        return res.status(400).json({ message: 'Invalid login credentials' });
      }

      // Check if the client's IP address has changed since the last login
      if (user.lastLoginIp && user.lastLoginIp !== clientIp) {
        console.log("IP address mismatch detected: Sending 2FA token");  // Log IP mismatch and 2FA token sending
        const twoFAToken = generate2FAToken();
        await send2FATokenEmail(user.email, twoFAToken);  // Send 2FA token to user's email
        user.twoFAToken = twoFAToken;
        await user.save();

        return res.status(200).json({
          message: 'Unusual login detected. A 2FA token has been sent to your email.',
        });
      }

      // Generate OTP and send it to the user's email (standard 2FA)
      const otp = generateOTP();
      console.log("OTP generated: ", otp);  // Log OTP generation
      await sendOTPEmail(user.email, otp);  // Send OTP to the user's email

      // Store OTP in the session or database temporarily for verification
      user.otp = otp;
      await user.save();

      // Send response asking for OTP
      console.log("OTP sent to user email: ", user.email); // Log OTP email sending
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
  console.log("OTP verification requested for: ", email);  // Log OTP verification request

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      console.log("Invalid OTP for user: ", email); // Log invalid OTP scenario
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
    console.log("OTP verified successfully, JWT token generated");  // Log successful OTP verification
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

// Handle Web3 login (using MetaMask)
export const web3Login = async (req, res) => {
  const { address, deviceId } = req.body;  // Capture deviceId for Web3 login
  console.log("Web3 login requested for address: ", address);  // Log Web3 login request

  try {
    // Check if user exists with the provided Ethereum address
    let user = await User.findOne({ web3Address: address });
    console.log("User found with Web3 address: ", user ? user.web3Address : 'No user found'); // Log Web3 user search

    if (!user) {
      // If user does not exist, create a new user with the provided Ethereum address
      user = new User({
        web3Address: address,
        username: `user_${address.slice(0, 6)}`,  // Assign a default username (you can ask user to set one later)
      });
      await user.save();
      console.log("New user created with Web3 address: ", address);  // Log new user creation
    }

    // Check if the device fingerprint matches for additional security
    const deviceFingerprint = generateDeviceFingerprint(deviceId);
    console.log("Device fingerprint generated for Web3 login: ", deviceFingerprint); // Log Web3 device fingerprint
    if (user.deviceFingerprint !== deviceFingerprint) {
      console.log("Device mismatch detected for Web3 login");  // Log device mismatch during Web3 login
      return res.status(400).json({ message: 'Unrecognized device. Please verify your identity.' });
    }

    // Create JWT token for Web3 login
    const payload = {
      userId: user._id,
      email: user.email,
    };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env file");
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Return success response with JWT token
    console.log("Web3 login successful, JWT token generated");  // Log successful Web3 login
    res.status(200).json({
      message: 'Web3 login successful',
      token,  // Send token as part of response
    });

  } catch (error) {
    console.error('Web3 login error:', error);
    res.status(500).json({ message: 'Error during Web3 login. Please try again.' });
  }
};
