const spoofIP = async () => {
    const email = 'hmehdi.bese21seecs@seecs.edu.pk';
    const password = 'Hmehdipw0';
    const deviceId = 'server-side-fingerprint'; // Correct device ID
  
    // Simulate an attacker's login from a different IP
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, deviceId }),
    });
  
    const result = await response.json();
    console.log("Attack result: "+result.message); // Expected reslts "OTP sent to your email. Please enter the OTP to complete login."
  };
  spoofIP();
  