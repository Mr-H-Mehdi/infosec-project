const bruteForceOTP = async () => {
    const email = 'hmehdi.bese21seecs@seecs.edu.pk';
    const fakeOTP = '123456'; // Simulate brute-force attempt
  
    // Simulate sending wrong OTP
    const response = await fetch('http://localhost:3000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: fakeOTP }),
    });
  
    const result = await response.json();
    console.log("Attack result: "+result.message); // Expecting "Invalid OTP. Please try again."
  };
  bruteForceOTP();
  