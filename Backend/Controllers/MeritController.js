const AcademicQualification = require("../Models/AcademicModel");
const PersonalInfo = require("../Models/PersonalInfoModel"); // import this

const getMeritList = async (req, res) => {
  try {
    const academicRecords = await AcademicQualification.find()
      .populate({
        path: 'userId',
        model: 'Student',
        select: 'email', // only selecting email from Student
      })
      .lean(); // convert Mongoose docs to plain JS objects

    // Fetch personal info separately and merge it with academicRecords
    const userIds = academicRecords.map(record => record.userId?._id);
    const personalInfos = await PersonalInfo.find({ userId: { $in: userIds } }).select('userId name').lean();

    const personalInfoMap = {};
    personalInfos.forEach(info => {
      personalInfoMap[info.userId.toString()] = info.name;
    });

    const enrichedRecords = academicRecords.map(record => {
      const userIdStr = record.userId?._id?.toString();
      return {
        ...record,
        userId: {
          ...record.userId,
          name: personalInfoMap[userIdStr] || 'N/A',
        },
      };
    });

    const meritList = enrichedRecords.filter(record => record.isEligibleForMeritList);
    const waitingList = enrichedRecords.filter(record => !record.isEligibleForTest || !record.isEligibleForMeritList);

    res.status(200).json({ meritList, waitingList });
  } catch (error) {
    console.error("Error retrieving merit list:", error);
    res.status(500).json({ message: "Error retrieving merit list", error: error.message });
  }
};


module.exports = getMeritList;
