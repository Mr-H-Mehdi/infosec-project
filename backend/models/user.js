import mongoose from 'mongoose';

// Create the schema for the user
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  otp: {
    type: String,  // Store the OTP temporarily for verification
  },  
  lastLoginIP: {
    type: String, // Store IP address of the last login
  },
  lastLoginRegion: {
    type: String, // Store the region (country) of the last login
  },
});
// Create the User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
