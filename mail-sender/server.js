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
    user: 'hdvkkr@gmail.com',          // بريدك
    pass: 'qzxl vvsh ukql qbgb'        // كلمة مرور التطبيق (App Password)
  }
});

// Unified /send route for both forms
app.post('/send', (req, res) => {
  const { name, email, subject, company, message } = req.body;

  console.log("📨 Request received:", req.body);

  if (!name || !email || !message) {
    return res.status(400).send("❌ Missing required fields");
  }

  // Use subject if available, otherwise default to a demo/contact label
  const emailSubject = subject 
    ? subject 
    : company 
      ? `📩 Demo Request from ${name}` 
      : `📩 Contact Message from ${name}`;

  // Construct email body dynamically
  const emailBody = `
    Name: ${name}
    Email: ${email}
    ${company ? `Company: ${company}` : ""}
    ${subject ? `Subject: ${subject}` : ""}
    Message:
    ${message}
  `;

  const mailOptions = {
    from: email,
    to: 'hdvkkr@gmail.com',
    subject: emailSubject,
    text: emailBody
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Error sending email:', error);
      return res.status(500).send('Failed to send the email.');
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
