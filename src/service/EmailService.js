const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP connection failed:", err);
  } else {
    console.log("✅ SMTP ready");
  }
});

async function sendWelcomeEmail(email, name) {
  if (!email) throw new Error("Email is required");

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Welcome 🎉",
      html: `
        <h2>Welcome ${name || "User"}!</h2>
        <p>We're excited to have you onboard 🚀</p>
      `,
    });

    console.log("Email sent:", info.messageId, name);
    return info;
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }
}

module.exports = { sendWelcomeEmail };
