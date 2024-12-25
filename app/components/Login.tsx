import { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isWeb3Login, setIsWeb3Login] = useState(false);

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

  const handleWeb3Login = async () => {
    try {
      // Check if MetaMask (or any Ethereum wallet) is installed
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request access to MetaMask

        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          setError('No Ethereum account found.');
          return;
        }

        const address = accounts[0];
        const response = await axios.post('http://localhost:3000/api/web3-login', { address });

        if (response.data.token) {
          onLogin(response.data.token);  // Handle successful Web3 login
        } else {
          setError('Failed to authenticate with Web3.');
        }
      } else {
        setError('Please install MetaMask to login with Web3.');
      }
    } catch (error) {
      setError('An error occurred during Web3 login.');
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

        {/* Web3 Login Button */}
        <button onClick={handleWeb3Login} className="w-full py-2 px-4 bg-gray-500 text-white hover:bg-gray-500 rounded-md" disabled={true}>
          Login with Web3 (MetaMask)
        </button>
      </div>
    </div>
  );
}
