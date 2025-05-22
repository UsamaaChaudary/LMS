const express = require('express');
const { registerUser, loginUser , fetchUsers ,  verifyCode , sendPasswordResetCode, resetPasswordWithCode , getStudentsOnly } = require('../Controllers/userController');
const router = express.Router();



router.post('/verify-code', verifyCode);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', sendPasswordResetCode);
router.post('/reset-password', resetPasswordWithCode);
router.get('/students', getStudentsOnly);



module.exports = router;
