import mongoose from 'mongoose';

// Create the schema for the user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure usernames are unique
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
});

// Create the User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
