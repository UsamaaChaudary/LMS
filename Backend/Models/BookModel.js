const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    edition: { type: String, required: true },
    language: { type: String, required: true },
    availability: { type: String, enum: ['Yes', 'No'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
