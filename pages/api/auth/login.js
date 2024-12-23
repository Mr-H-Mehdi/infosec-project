const { verifyTOTP } = require('../../../backend/auth/verifyTOTP');
const { hashDeviceInfo } = require('../../../backend/auth/deviceBinding');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { token, secret, userAgent, macAddress } = req.body;
    const deviceHash = hashDeviceInfo(userAgent + macAddress);

    // Retrieve stored secret and deviceHash from the database (pseudo code)
    // const storedSecret = db.getSecret();
    // const storedDeviceHash = db.getDeviceHash();

    if (verifyTOTP(token, secret) && deviceHash === storedDeviceHash) {
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}