import nodemailer from 'nodemailer';
import { scheduleJob } from 'node-schedule';
import dotenv from 'dotenv';
dotenv.config();
// Function to send email notifications
async function sendPasswordChangeNotification(email) {
  try {
    // Configure the SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Email options
    const mailOptions = {
      from: 'nnaveed.bese21seecs@seecs.edu.pk',
      to: email,
      subject: 'Password Change Reminder',
      text: 'Dear user, \n\nIt has been 15 days since you last updated your password. For your security, we recommend changing your password regularly.\n\nThank you!',
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Notification sent to:', email, info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Function to schedule notifications
function schedulePasswordNotifications(email) {
  // Schedule the job to run every 15 days at 9:00 AM
  scheduleJob('0 9 */15 * *', () => {
    console.log(`Sending password change notification to ${email}...`);
    sendPasswordChangeNotification(email);
  });
}

// Example usage
const userEmail = 'nnaveed.bese21seecs@seecs.edu.pk'; // Replace with user's email
schedulePasswordNotifications(userEmail);

console.log('Password change notification scheduler is running.');
