const express = require("express");
const router = express.Router(); 
const {registerStudent,loginstudent,quiz}=require('../controllers/studcontroller')
router.route('/signup').post(registerStudent); 
router.route('/login').post(loginstudent)
router.route('/quiz').post(quiz)
module.exports = router ; 


