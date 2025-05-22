const express = require('express');
const router = express.Router();
const { StudentPersonalInfo, getPersonalInfo , updatePersonalInfo } = require('../Controllers/personalInfoController');
const upload = require('../Middleware/uploadMiddlware');
const authMiddleware = require('../Middleware/authMiddleware');

router.post('/StudentPersonalDetails', upload.single('file'), StudentPersonalInfo);
router.post('/UpdatePersonalDetails', upload.single('file'), updatePersonalInfo);
router.get('/GetNameAndEmail', getPersonalInfo); 
module.exports = router;
