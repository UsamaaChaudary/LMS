const Request = require("../Models/RequestBookModel");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");


const addRequest = async (req, res) => {
  try {
    const { studentName, bsfId, daysRequested, bookName, authorName } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const email = user.email;

    const newRequest = new Request({
      studentName,
      email,
      bsfId,
      daysRequested,
      bookName,
      authorName,
      status: "Request Submitted",
      statusHistory: ["Request Submitted"]
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully!" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Error submitting request",
      error: error.message || "Internal Server Error",
    });
  }
};


const getRequestsByEmail = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const email = user.email;
    const requests = await Request.find({ email });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};


const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find({}).sort({ dateOfRequest: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching requests for librarian", 
      error: error.message 
    });
  }
};



const updateRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Approving user not found" });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const newStatusEntry = `${status} by ${user.role} ${user.name}`;

    request.statusHistory.push(newStatusEntry);
    request.status = newStatusEntry;

    await request.save();

    res.status(200).json({ message: "Request status updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { 
  getRequestsByEmail, 
  addRequest, 
  getAllRequests, 
  updateRequestStatus 
};