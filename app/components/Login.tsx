import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      if (response.data.message === 'OTP sent to your email. Please enter the OTP to complete login.') {
        setIsOtpSent(true);
        setError('');  // Reset error message if login is successful
      } else {
        setError('Invalid login credentials.');
      }
    } catch (error) {
      setError('Could not sign you in. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/verify-otp', {
        email,
        otp,
      });

      if (response.data.token) {
        onLogin(response.data.token);
      }
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="max-w-md w-full p-8 rounded-lg shadow-xl space-y-6 bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>
        <p className="text-center text-gray-400">Sign in to your account</p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!isOtpSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Existing email and password fields */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-primary text-white hover:bg-primary-dark rounded-md">Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-200">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-md text-white"
                required
              />
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-primary text-white hover:bg-primary-dark rounded-md">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
}
