// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
const profRoutes = require("./routes/profRoutes");app.use("/prof", profRoutes);
const studRoutes = require("./routes/studRoutes");app.use("/stud", studRoutes);

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

const Student = require("./models/studentModel");
const Professor = require("./models/profModel");
const {generateCertificate,sendCertificate}=require("./controllers/certif")



// *********************** Displaying top 3 students and sending certificate to the first winner
app.get("/winners", async (req, res) => {
  try {
    const winners = await Student.find().sort({ score: -1, lastScoreUpdate: 1 }).limit(3).select("name email score -_id");

    if (winners.length > 0) {
      const firstWinner = winners[0];
      const certificateBytes = await generateCertificate(firstWinner.name);
      await sendCertificate(firstWinner.email, certificateBytes);
      console.log(`Certificate sent to ${firstWinner.name} (${firstWinner.email})!`);
    }
    res.json({
      message: "TOP 3 Students",
      data:{winners}
      });
  } catch (err) {
    console.error("Error fetching winners or sending certificate:", err);
    res.status(500).send("Error fetching winners or sending certificate.");
  }
});

// **************************** Displaying all students ************************** 
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find().select("name email score -_id");

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé" });
    }

    res.status(200).json({
      message: "Étudiants récupérés avec succès",
      results: students.length,
      data: { students },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur lors de la récupération des étudiants" });
  }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}...`);
});
