

const nodemailer = require("nodemailer");
const Professor = require('../models/profModel');
exports.sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to, 
      subject,
      text
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  };
  
exports.vMail = async (req, res) => {
    const { token } = req.query;
  
    try {
      const professor = await Professor.findOne({ verificationkey: token });
  
      if (!professor) {
        return res.status(400).json({ message: "invalide verification key" });
      }
      if (Date.now() > professor.expiresAt) {
        return res.status(400).json({ message: 'Verification key has expired' });
      }
      professor.isVerified = true;
      professor.verificationkey = undefined;
      await professor.save();
  
      res.status(200).json({ message: "account activated ." });
    } catch (error) {
      res.status(500).json({ message: "an error has occured", error: error.message });
    }
  };