const express = require('express');
const router = express.Router();
const {  submitAssignment, getAssignments } = require('../controllers/assignmentController');
const upload = require('../Middleware/uploadMiddlware');


router.get('/',  getAssignments);
router.post('/submit', upload.single('file') , submitAssignment);

module.exports = router;
