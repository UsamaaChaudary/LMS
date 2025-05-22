const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    creditHours: { type: Number, required: true },
    year: { type: Number, required: true },
    semester: { type: String, required: true },
    allocatedTo: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
