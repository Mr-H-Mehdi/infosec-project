import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [secret, setSecret] = useState('');
  const [otpAuthUrl, setOtpAuthUrl] = useState('');

  const handleRegister = async () => {
    const userAgent = navigator.userAgent;
    const macAddress = '00:00:00:00:00:00'; // Replace with actual MAC address retrieval logic

    const response = await axios.post('/api/auth/register', { userAgent, macAddress });
    setSecret(response.data.secret);
    setOtpAuthUrl(response.data.otpauth_url);
  };

  return (
    <div>
      <button onClick={handleRegister}>Register</button>
      {otpAuthUrl && (
        <div>
          <p>Scan this QR code with your authenticator app:</p>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${otpAuthUrl}`} alt="QR Code" />
          <p>Secret: {secret}</p>
        </div>
      )}
    </div>
  );
};

export default Register;