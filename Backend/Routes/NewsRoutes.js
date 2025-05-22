const express = require("express");
const router = express.Router();
const { uploadNews, getAllNews, deleteNews } = require("../Controllers/newsController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/upload", uploadNews);
router.get("/all", authMiddleware, getAllNews);
router.delete("/delete/:id", authMiddleware, deleteNews);

module.exports = router;
