const express = require('express');
const { addCourse , getCourses  , updateCourse , deleteCourse, } = require('../Controllers/courseController');
const router = express.Router();


router.post('/courses/add-course', addCourse);
router.get('/courses', getCourses);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

module.exports = router;
