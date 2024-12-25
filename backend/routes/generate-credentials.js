import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // Make sure the extension is `.js`

// Connect to MongoDB
const connectDB = async () => {
  console.log("Hello1")
  if (mongoose.connections[0].readyState) return; // If already connected, do nothing
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hmk01:hmk1@cluster0.kfaczau.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// API Route to accept and store credentials
export default async function handler(req, res) {
  console.log("Hello2")

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed, use POST' });
  }

  // Get credentials from the request body (expecting username, password, email)
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'All fields (username, password, email) are required' });
  }

  try {
    // Connect to MongoDB database
    await connectDB();

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    
    if (existingUser) {
      // If a user already exists, delete the existing user
      await User.deleteOne({ _id: existingUser._id });
      console.log('Existing user deleted');
    }

    // Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success response
    res.status(201).json({ message: 'User created successfully', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user. Please try again.' });
  }
}
