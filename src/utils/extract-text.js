const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const xlsx = require("xlsx");

// Extract text from different file types
const extractText = async (filePath, mimeType) => {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(fs.readFileSync(filePath));
    return data.text;
  } else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  } else if (mimeType === "text/plain") {
    return fs.readFileSync(filePath, "utf-8");
  } else if (
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel"
  ) {
    return extractTextFromExcel(filePath);
  } else {
    throw new Error("Unsupported file type");
  }
};

// Extract text from Excel files
const extractTextFromExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  let text = "";

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    text += xlsx.utils.sheet_to_csv(sheet) + "\n";
  });

  return text.trim();
};

module.exports = extractText;
