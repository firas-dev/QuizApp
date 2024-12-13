const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const Professor = require('../models/profModel');
const Quiz = require('../models/quizModel');
// ****************************** signUp for professors ***************************************
exports.registerProfessor = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingProfessor = await Professor.findOne({ email });
      if (existingProfessor) {
        return res.status(400).json({ message: 'Ce professeur est déjà inscrit' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newProfessor = new Professor({
        name,
        email,
        password: hashedPassword,
      });
  
      await newProfessor.save();
      res.status(201).json({ message: 'Professeur inscrit avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Une erreur est survenue', error: error.message });
    }
  };

// **************************** Sign In for professors ********************************************   
exports.loginprofessor = async (req, res) => {
  const { email, password } = req.body;
  const professor = await Professor.findOne({ email });
  if (!professor) {
    return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
  }
  const isMatch = await bcrypt.compare(password, professor.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign({ professorId: professor._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ message: 'Connexion réussie', token });
}; 


// *************************** Quiz's Creation ********************** 

exports.createQuiz = async (req, res) => {
  const { token, title, description, questions } = req.body;
  try {
    
    const decoded = jwt.verify(token, 'secretkey');
    const professor = await Professor.findById(decoded.professorId);
    if (!professor) {
      return res.status(400).json({ message: 'Professeur introuvable' });
    }
    
    const newQuiz = new Quiz({
      title,
      description,
      professor: professor._id,
      questions
    });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz créé avec succès', quiz: newQuiz });
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};


