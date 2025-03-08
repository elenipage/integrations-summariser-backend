const express = require("express");
const multer = require("multer");
const { uploadFiles } = require("../controllers/fileController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Change from single file to multiple files
router.post("/upload", upload.array("files", 5), uploadFiles);

module.exports = router;
