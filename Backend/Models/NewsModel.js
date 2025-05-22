const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: { type: String, required: false },
  imageUrl: { type: String, required: false },
  category: { 
    type: String, 
    required: true,
    enum: ['general', 'academic', 'events', 'announcements', 'holidays'],
    default: 'general'
  },
  datePosted: { type: Date, required: true },
  dateExpiry: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("News", NewsSchema);
