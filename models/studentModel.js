const mongoose = require("mongoose");


const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    key: { type: String, required: true },
    score: { type: Number, default: 0 },
    lastScoreUpdate: {type:Date},
    tokenUsed: { type: Boolean, default: false }
  });

  const Student = mongoose.model('Student', studentSchema);
  module.exports = Student; 