const { PDFDocument, rgb } = require("pdf-lib");
const nodemailer = require("nodemailer");
const fs = require("fs");
const CERTIF_PATH = "C:/Users/monta/Desktop/app/components/certification.pdf";

// ********* certificate generation (personalized by student name )
exports.generateCertificate = async (name,score) => {
  const tmp = fs.readFileSync(CERTIF_PATH);
  const pdfDoc = await PDFDocument.load(tmp);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const fontSize = 36;
  const fontSize1 = 27;
  firstPage.drawText(name, {
    x: 300,
    y: 680, // Adjust as needed
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  // Draw the score
  firstPage.drawText(`${score}`, {
    x: 170,
    y: 612, // Adjust to avoid overlapping the name
    size: fontSize1,
    color: rgb(0, 0, 0),
  });

  return pdfDoc.save(); 
};

// ************ sending the certificate to the first winner ******************  
exports.sendCertificate = async (email, certificateBytes) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
        from: '"Certification Team" <QuizTest@gmail.com>',
        to: email,
        subject: "Quiz Certificate",
        text: "Congratulations! Find your certificate attached.",
        attachments: [
          {
            filename: "certificate.pdf",
            content: certificateBytes,
            contentType: "application/pdf",
          },
        ],
      };
    
      await transporter.sendMail(mailOptions);
    };