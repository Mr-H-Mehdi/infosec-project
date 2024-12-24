'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To show error messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the login request to the backend
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });

      console.log("Done1");
      console.log(response.data.message);
      if (response.data.message === 'Login successful') {
        // If credentials are correct, call onLogin to indicate successful login        
        onLogin();
      } else {
        // If authentication fails, show the error message
        setError(response.data.message || 'Invalid login credentials. Please try again.');
      }
    } catch (error) {
      setError('Could not sign you in. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-primary ">
      <div className="max-w-md w-full p-8 rounded-lg shadow-xl space-y-6 bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-white">Welcome Back</h2>

        <p className="text-center text-gray-400">Sign in to your account</p>

        {/* Display error message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-primary border-gray-600 rounded"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-200">Remember me</label>
            </div>
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-white hover:bg-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
}
