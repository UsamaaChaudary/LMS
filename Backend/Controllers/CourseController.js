const Course = require('../Models/Coursemodel');
const User = require('../Models/UserModel');



const addCourse = async (req, res) => {
    try {
        const { title, creditHours, year, semester, allocatedTo } = req.body;

        if (!title || !creditHours || !year || !semester || !allocatedTo) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

      
        const newCourse = new Course({ title, creditHours, year, semester, allocatedTo });
        await newCourse.save();


        res.status(201).json({ message: 'Course added successfully!', course: newCourse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add course.', details: error.message });
    }
};


const getCourses = async (req, res) => {
  try {
    const courses = await Course.find(); 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
};



const updateCourse = async (req, res) => {
    try {
        const { title, creditHours, year, semester, allocatedTo } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { title, creditHours, year, semester, allocatedTo },
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        await User.updateMany(
            { courses: updatedCourse._id },
            { $pull: { courses: updatedCourse._id } }
        );
        await User.updateMany(
            { _id: { $in: allocatedTo } },
            { $addToSet: { courses: updatedCourse._id } }
        );

        res.status(200).json({ message: 'Course updated successfully!', course: updatedCourse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update course.' });
    }
};



const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        await User.updateMany(
            { courses: deletedCourse._id },
            { $pull: { courses: deletedCourse._id } }
        );

        res.status(200).json({ message: 'Course deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete course.' });
    }
};



module.exports = {
    addCourse,
    getCourses,
    updateCourse,
    deleteCourse,
};
