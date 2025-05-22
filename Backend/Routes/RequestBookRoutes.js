const express = require("express");
const router = express.Router();
const {getRequestsByEmail , addRequest , getAllRequests , updateRequestStatus} = require("../Controllers/requestBookController");
const authMiddleware = require('../Middleware/authMiddleware');


router.post("/add-request", authMiddleware , addRequest);
router.get("/my-requests", authMiddleware , getRequestsByEmail);
router.get("/all-requests" , getAllRequests);
router.post('/updateRequestStatus', authMiddleware,  updateRequestStatus);

module.exports = router;

