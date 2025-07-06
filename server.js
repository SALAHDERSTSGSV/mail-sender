const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer setup - using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hdvkkr@gmail.com',          // Your email
    pass: 'qzxl vvsh ukql qbgb'        // App password from Gmail
  }
});

// Handle form data
app.post('/send', (req, res) => {
  const { name, email, company, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'hdvkkr@gmail.com',
    subject: `📩 Demo request from: ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Company: ${company}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error);
      res.status(500).send('Failed to send the email.');
    } else {
      console.log('✅ Email sent:', info.response);
      res.status(200).send('Email sent successfully.');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
