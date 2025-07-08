console.log("Starting server...");

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send', (req, res) => {
  const { name, email, subject, company, message } = req.body;

  console.log("📨 Request received:", req.body);

  if (!name || !email || !message) {
    return res.status(400).send("❌ Missing required fields");
  }

  const emailSubject = subject
    ? subject
    : company
      ? `📩 Demo Request from ${name}`
      : `📩 Contact Message from ${name}`;

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
    to: process.env.EMAIL_USER,
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

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
