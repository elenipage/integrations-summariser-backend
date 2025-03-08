const fs = require("fs");
const extractText = require("../utils/extractText");
const summarizeText = require("../models/summarizer");

// Handle multiple file uploads
const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    let results = [];

    for (const file of req.files) {
      const filePath = file.path;
      const extractedText = await extractText(filePath, file.mimetype);

      // Delete file after processing
      fs.unlinkSync(filePath);

      // Generate summary
      const summary = await summarizeText(extractedText);

      results.push({
        filename: file.originalname,
        summary,
      });
    }

    res.json({ summaries: results });

  } catch (error) {
    console.error("Error processing files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadFiles };
