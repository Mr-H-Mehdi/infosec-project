'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Handle login (email & password authentication)
  const handleLogin = async () => {
    try {
      // Make POST request to the backend API (Backend is on port 3000)
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password,
      });
      console.log(response)
      if (response.data.message === 'Login successful') {
        // If login is successful, trigger the onLogin callback to update UI state
        onLogin(); // Call onLogin prop passed from page.tsx
        setMessage('Login successful!');
        // Optionally, redirect to a protected route, e.g., router.push('/homepage');
      } else {
        setMessage(response.data.message); // Display error message from backend
      }
    } catch (error) {
      setMessage('Error during login. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <button onClick={handleLogin}>Login</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
