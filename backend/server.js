import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // Import the auth route file

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors()); // You can restrict this if needed

// MongoDB connection
mongoose.connect('mongodb+srv://hmk01:hmk1@cluster0.kfaczau.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the auth routes for login
app.use('/api', authRoutes); // Prefix the routes with `/api`

// Start the server on a different port (e.g., 3000 for the backend)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
