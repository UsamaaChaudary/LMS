const Attendance = require('../Models/AttendanceModel');
const User = require("../Models/UserModel");



const markAttendance = async (req, res) => {
  const { attendanceData } = req.body;
  try {
    const attendanceRecords = await Attendance.insertMany(attendanceData);
    res.status(201).json({ message: "Attendance marked successfully", attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error });
  }
};



const getAttendanceByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const attendance = await Attendance.find({ userId }).populate("courseId");

    const groupedByMonth = attendance.reduce((acc, record) => {
      const date = new Date(record.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYear = `${month}-${year}`;
      const courseTitle = record.courseId?.title || "Unknown Course";

      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }
      
      if (!acc[monthYear][courseTitle]) {
        acc[monthYear][courseTitle] = { total: 0, present: 0 };
      }
      
      acc[monthYear][courseTitle].total += 1;
      if (record.status === "present") {
        acc[monthYear][courseTitle].present += 1;
      }
      
      return acc;
    }, {});

    // Convert the grouped data into the response format
    const response = [];
    
    Object.entries(groupedByMonth).forEach(([monthYear, courses]) => {
      Object.entries(courses).forEach(([course, data]) => {
        response.push({
          monthYear,
          month: parseInt(monthYear.split('-')[0]),
          year: parseInt(monthYear.split('-')[1]),
          course,
          totalDays: data.total,
          presentDays: data.present,
          percentage: ((data.present / data.total) * 100).toFixed(2),
          status: data.present > 0 ? 'present' : 'absent'
        });
      });
    });

    res.json(response);
  } catch (error) {
    console.error("Error in getAttendanceByUserId:", error);
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
};



module.exports = { markAttendance, getAttendanceByUserId };
