const express = require("express");
const router = express.Router();
const { registerProfessor,loginprofessor,createQuiz } = require('../controllers/profcontroller'); 
const { vMail } = require('../controllers/mailverif'); 
router.route("/signup").post(registerProfessor) 
router.route("/login").post(loginprofessor)
router.route("/createQuiz").post(createQuiz)
router.route("/verif").post(vMail)

module.exports = router ;