const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const profRoutes = require('./routes/profRoutes')
const studRoutes = require('./routes/studRoutes')
app.use(express.json());
app.use('/prof',profRoutes)
app.use('/stud',studRoutes)
// ****************************** Data base connection ********************************************** 
const DB = process.env.DATABASE.replace(
    "<db_password>",
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(DB)
    .then(() => {
      console.log("DB Connection secured!!!");
    })
    .catch((err) => {
      console.log(err);
    });
// Modèles
const Student = require('./models/studentModel');
const Professor = require('./models/profModel');


// ************************  displaying top 3 students *******************************
app.get('/winners', async (req, res) => {
  const winners = await Student.find().sort({ score: -1 }).limit(3);
  res.json(winners);
});

// ************************* displaying all students ************************ 
app.get('/students' , async (req, res) => {
  try {

    const students = await Student.find().select('name email -_id'); 

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Aucun étudiant trouvé' });
    }

    res.status(200).json({
      message: 'Étudiants récupérés avec succès',
      results: students.length,
      data: { students }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des étudiants' });
  }
});

// ************************* displaying all professors ************************ 






// start the server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}...`);
});