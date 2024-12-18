const bcrypt = require('bcrypt'); 
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const Professor = require('../models/profModel');
const Quiz = require('../models/quizModel');
const{sendMail}=require('./mailverif'); 


// ****************************** signUp for professors ***************************************
exports.registerProfessor = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingProfessor = await Professor.findOne({ email });
      if (existingProfessor) {
        return res.status(400).json({ message: 'you already have an account !! try to login' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationkey = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 60*60*1000;
      const newProfessor = new Professor({
        name,
        email,
        password: hashedPassword,
        verificationkey,
        isVerified: false,
        expiresAt,
      });
  
      await newProfessor.save();

      const verificationLink = `http://localhost:${process.env.PORT}/prof/verif?token=${verificationkey}`;
      const emailText = `Bonjour ${name},\n\nVeuillez vérifier votre adresse e-mail en cliquant sur le lien suivant :\n${verificationLink}\n\nMerci. NB !! lien de vérification est valable seulement pour une heure`;
      await  sendMail(email, "Vérification de l'adresse e-mail", emailText);
      res.status(201).json({ message: 'you have successfully signed up !! , please check your e-mail and activate your account."',verificationLink });
    
    } catch (error) {
      res.status(500).json({ message: 'error occured', error: error.message });
    }
  };

// **************************** Sign In for professors ********************************************   
exports.loginprofessor = async (req, res) => {
  const { email, password } = req.body;
  const professor = await Professor.findOne({ email });
  if (!professor) {
    return res.status(400).json({ message: 'incorrect Email or password!!please check your input' });
  }
  else if(!professor.isVerified){
    return res.status(400).json({ message: 'please activate your account so you can log in !! ' });
  }
  const isMatch = await bcrypt.compare(password, professor.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'incorrect Email or password!!please check your input' });
  }

  const token = jwt.sign({ professorId: professor._id }, 'secretkey', { expiresIn: '1h' });
  
  const tokenCreatedAt = new Date();
  const tokenExpiresAt = new Date(tokenCreatedAt.getTime() +60 * 60 * 1000); 

  res.json({ message: 'Successful connection', token,tokenCreatedAt: tokenCreatedAt.toISOString(),
  tokenExpiresAt: tokenExpiresAt.toISOString(), });
}; 


// *************************** Quiz's Creation ********************** 

exports.createQuiz = async (req, res) => {
  const { token, title, description, questions } = req.body;
  try {
    const decoded = jwt.verify(token, 'secretkey');
    const professor = await Professor.findById(decoded.professorId);
    if (!professor) {
      return res.status(400).json({ message: 'Unfound Professeur' });
    }
    const newQuiz = new Quiz({
      title,
      description,
      professor: professor._id,
      questions
    });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz Successfully created ', quiz: newQuiz });
  } catch (error) {
    return res.status(401).json({ message: 'invalide or expired Token !! please try to log in again ' });
  }
};


