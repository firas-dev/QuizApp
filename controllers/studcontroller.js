const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const Student = require('../models/studentModel');
const Quiz = require('../models/quizModel');
// ********************* signUp for student *******************************
exports.registerStudent = async (req, res) => {
    const { name, email, password } = req.body;
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'you already have an account !! try to login' });
    }
    const key = Math.random().toString(36).substring(2, 15);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      key
    });
    await newStudent.save();
    res.status(201).json({ message: 'you have successfully signed up !! ', key });
  };


// *************************** log in for student ***************************

exports.loginstudent = async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(400).json({ message: 'incorrect Email or password!!please check your input' });
  }
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'incorrect Email or password!!please check your input' });
  }
  const token = jwt.sign({ studentId: student._id }, 'secretkey', { expiresIn: '30m' });
  res.json({ message: 'successfully connected !! ', token });
};

// ********************* Réponse au quiz ******************** 
exports.quiz = async (req, res) => {
  const { token, quizId, responses } = req.body;

  try {
    const decoded = jwt.verify(token, 'secretkey');
    const student = await Student.findById(decoded.studentId);
    if (!student) {
      return res.status(400).json({ message: 'unfound student' });
    }
    if (student.tokenUsed) {
      return res.status(400).json({ message: 'Expired Token !' });
    }
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(400).json({ message: 'unfound Quiz' });
    }

    if (!responses) {
      const quizQuestions = quiz.questions.map((question) => ({
        questionText: question.questionText,
        options: question.options.map((option) => ({
          optionIndex:option.optionIndex,
          optionText: option.optionText,

        })),
      }));

      return res.json({
        message: 'Try to respond to this Quiz',
        title: quiz.title,
        description: quiz.description,
        questions: quizQuestions,
      });
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const studentResponse = responses[index]; 
      // ****** check student responses 
      const correctOption = question.options.find(option => option.isCorrect);
      if (studentResponse === correctOption.optionIndex) {
        score++; 
      }
    });
    // ***** update student score
    student.score = score;
    student.lastScoreUpdate = new Date();
    student.tokenUsed = true;
    await student.save();
    res.json({ message: 'Score saved successfully', score: student.score,token });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'invalide or expired Token !! ' });
  }
};


