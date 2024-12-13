const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma du professeur
const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'professor' }
});

const Professor = mongoose.model('Professor', professorSchema);
module.exports = Professor;
