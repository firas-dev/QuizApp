const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [
        { optionText: String,optionIndex: String ,isCorrect: Boolean }
      ]
    }
  ]
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;