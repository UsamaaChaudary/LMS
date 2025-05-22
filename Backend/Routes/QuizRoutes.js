const express = require("express");
const multer = require("multer");
const { uploadQuiz, getAllQuizzes } = require("../Controllers/QuizController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/uploadquiz", upload.single("file"), uploadQuiz);
router.get("/getquizzes", getAllQuizzes);

module.exports = router;
