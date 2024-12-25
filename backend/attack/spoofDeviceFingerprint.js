const spoofDeviceFingerprint = async () => {
    const email = 'hmehdi.bese21seecs@seecs.edu.pk';
    const password = 'Hmehdipw0'; // Correct password
    const fakeDeviceId = 'device-5678'; // Spoofed device fingerprint
  
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, deviceId: fakeDeviceId }),
    });
  
    const result = await response.json();
    console.log("Attack result: "+result.message); // Expecting "Unrecognized device. Please verify your identity."
  };
  spoofDeviceFingerprint();
  