import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, projectType, message } = req.body;

    if (!name || !email || !projectType || !message) {
      res.status(400).json({ success: false, error: 'All fields are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Portfolio Alerts" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Inquiry from ${name}`,
        text: `You have a new inquiry!\n\nName: ${name}\nEmail: ${email}\nProject Type: ${projectType}\nMessage:\n${message}`,
        html: `<h3>New Inquiry Received</h3>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Project Type:</strong> ${projectType}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`
      });
      console.log('Email notification sent for inquiry:', email);
    } else {
      console.error('EMAIL_USER or EMAIL_PASS is not set in environment variables.');
    }

    res.status(201).json({ success: true, message: 'Inquiry successfully submitted!' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Server error processing your inquiry.' });
  }
}
