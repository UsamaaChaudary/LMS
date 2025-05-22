const News = require("../Models/NewsModel");


exports.uploadNews = async (req, res) => {
  try {
    const { title, content, url, imageUrl, category, datePosted, dateExpiry } = req.body;

    if (!title || !content || !datePosted || !dateExpiry) {
      return res.status(400).json({ message: "Title, content, and dates are required!" });
    }

    const news = new News({ 
      title, 
      content, 
      url, 
      imageUrl, 
      category, 
      datePosted, 
      dateExpiry 
    });
    
    await news.save();

    res.status(201).json({ message: "News uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading news:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};


exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ datePosted: -1 });
    res.status(200).json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};



exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await News.findByIdAndDelete(id);
    res.status(200).json({ message: "News deleted successfully!" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
