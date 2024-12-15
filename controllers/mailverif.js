

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
      from: process.env.EMAIL_USER, // Sender email
      to, // Recipient email
      subject, // Email subject
      text // Email body content
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
      const professor = await Professor.findOne({ verificationToken: token });
  
      if (!professor) {
        return res.status(400).json({ message: "Token de vérification invalide" });
      }
  
      professor.isVerified = true;
      professor.verificationToken = undefined;
      await professor.save();
  
      res.status(200).json({ message: "Adresse e-mail vérifiée avec succès." });
    } catch (error) {
      res.status(500).json({ message: "Une erreur est survenue", error: error.message });
    }
  };