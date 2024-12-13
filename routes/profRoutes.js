const express = require("express");
const router = express.Router();
const { registerProfessor,loginprofessor,createQuiz } = require('../controllers/profcontroller'); 
router.route("/signup").post(registerProfessor) 
router.route("/login").post(loginprofessor)
router.route("/createQuiz").post(createQuiz)


module.exports = router ;