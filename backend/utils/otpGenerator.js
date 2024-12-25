// OTP Generation Function (for 6-digit OTP)
export const generateOTP = () => {
  // Generate a random 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 2FA Token Generation Function (for example, using TOTP)
export const generate2FAToken = () => {
  // This is just a simple example of generating a 6-digit 2FA token
  // In a real-world application, you would use a library like speakeasy or otplib
  return Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit token
};
