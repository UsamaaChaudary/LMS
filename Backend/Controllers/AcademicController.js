const AcademicQualification = require('../Models/AcademicModel');



const addAcademicQualification = async (req, res) => {
    const studentId = req.user.id;
    const {
        degreeLevel,
        degreeTitle,
        board,
        registrationNumber,
        passingYear,
        examinationType,
        marksType,
        obtainedMarks,
        totalMarks,
        degreeLevel2,
        degreeTitle2,
        board2,
        registrationNumber2,
        passingYear2,
        examinationType2,
        marksType2,
        obtainedMarks2,
        totalMarks2,
    } = req.body;

    const sscMarksheet = req.files?.sscMarksheet?.[0]?.path || null;
    const hsscMarksheet = req.files?.hsscMarksheet?.[0]?.path || null;

    try {
        const existingRecord = await AcademicQualification.findOne({ userId : studentId });
        if (existingRecord) {
            return res.status(400).json({ message: 'Academic record already exists' });
        }

        const sscMeritPercentage = (obtainedMarks / totalMarks) * 100;
        const hsscMeritPercentage = (obtainedMarks2 / totalMarks2) * 100;
        const TestMeritPercentage = sscMeritPercentage * 0.4 + hsscMeritPercentage * 0.6;
        const isEligibleForTest = TestMeritPercentage >= 75;

        let finalMeritPercentage;

        if (!isEligibleForTest) {
            finalMeritPercentage = (sscMeritPercentage * 0.4) + (hsscMeritPercentage * 0.6);
        } else {
            finalMeritPercentage = null;
        }

        const academicData = {
            userId: studentId,
            degreeLevel,
            degreeTitle,
            board,
            registrationNumber,
            passingYear,
            examinationType,
            marksType,
            obtainedMarks,
            totalMarks,
            sscMarksheet,
            hsscMarksheet,
            degreeLevel2,
            degreeTitle2,
            board2,
            registrationNumber2,
            passingYear2,
            examinationType2,
            marksType2,
            obtainedMarks2,
            totalMarks2,
            TestMeritPercentage,
            isEligibleForTest,
            finalMeritPercentage,
        };

        const newAcademic = await AcademicQualification.create(academicData);

        res.status(201).json({
            message: isEligibleForTest
                ? 'You are eligible for the test.'
                : 'You are not eligible for the test.',
            isEligibleForTest,
            data: newAcademic,
        });
    } catch (error) {
        console.error('Error occurred while adding academic record:', error);
        res.status(500).json({ message: 'Error adding academic record', error: error.message });
    }
};




const saveTestResult = async (req, res) => {
    const { testScore } = req.body;
    const studentId = req.user.id;

    try {
        const academicRecord = await AcademicQualification.findOne({
            userId: studentId,
        });

        if (!academicRecord) {
            return res.status(404).json({ message: 'Academic record not found' });
        }

        if (!academicRecord.isEligibleForTest) {
            academicRecord.mcqScore = 0;
        } else {
            academicRecord.mcqScore = testScore;
            const sscMeritPercentage = (academicRecord.obtainedMarks / academicRecord.totalMarks) * 100;
            const hsscMeritPercentage = (academicRecord.obtainedMarks2 / academicRecord.totalMarks2) * 100;
            const finalMeritPercentage = (sscMeritPercentage * 0.2) + (hsscMeritPercentage * 0.35) + (testScore * 0.45);
            academicRecord.finalMeritPercentage = finalMeritPercentage;
        }

        academicRecord.isEligibleForMeritList = academicRecord.finalMeritPercentage >= 75;

        await academicRecord.save();
        res.status(200).json({
            message: academicRecord.isEligibleForMeritList
                ? 'You are eligible for the merit list.'
                : 'You are not eligible for the merit list.',
            finalMeritPercentage: academicRecord.finalMeritPercentage,
            isEligibleForMeritList: academicRecord.isEligibleForMeritList,
        });
    } catch (error) {
        console.error('Error saving test result:', error);
        res.status(500).json({ message: 'Error saving test result', error: error.message });
    }
};




module.exports = { addAcademicQualification, saveTestResult };
