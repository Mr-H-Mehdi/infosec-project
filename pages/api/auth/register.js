const { generateSecret } = require('../../../backend/auth/generateTOTP');
const { hashDeviceInfo } = require('../../../backend/auth/deviceBinding');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userAgent, macAddress } = req.body;
    const secret = generateSecret();
    const deviceHash = hashDeviceInfo(userAgent + macAddress);

    // Save secret and deviceHash to the database (pseudo code)
    // db.save({ secret: secret.base32, deviceHash });

    res.status(200).json({ secret: secret.base32, otpauth_url: secret.otpauth_url });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}