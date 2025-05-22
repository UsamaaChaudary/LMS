const AcademicQualification = require("../Models/AcademicModel"); 
const PersonalInfo = require("../Models/PersonalInfoModel"); 
const PDFDocument = require('pdfkit');
const fs = require('fs');

const generateChallan = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find academic record
    const academicRecord = await AcademicQualification.findById(id);
    if (!academicRecord) {
      return res.status(404).json({ message: "Academic record not found" });
    }

    // Step 2: Find personal info using academicRecord.userId
    const personalInfo = await PersonalInfo.findOne({ userId: academicRecord.userId });
    if (!personalInfo) {
      return res.status(404).json({ message: "Personal info not found for the user" });
    }

    // Step 3: Generate challan
    const doc = new PDFDocument();
    const filePath = `./challans/challan_${id}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('University of Education - Challan', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${personalInfo.name}`);
    doc.text(`Email: ${personalInfo.email}`);
    doc.text(`Merit Percentage: ${academicRecord.finalMeritPercentage}%`);
    doc.text(`Challan Number: ${id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.end();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=challan_${id}.pdf`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Error generating challan:", error);
    res.status(500).json({ message: "Error generating challan", error });
  }
};

module.exports = generateChallan;
