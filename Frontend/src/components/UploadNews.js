import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import newsAnimation from '../animations/news-animation.json';
import "./UploadNews.css";


const UploadNewsPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [dateExpiry, setDateExpiry] = useState("");
  const [category, setCategory] = useState("general");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadNews = async () => {
    if (!title || !content || !datePosted || !dateExpiry) {
      alert("❌ Error: Title, content, and dates are required!");
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/news/upload", {
        title, 
        content,
        url, 
        datePosted, 
        dateExpiry,
        category,
        imageUrl
      });
      alert("✅ Success: News uploaded successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("❌ Error: Failed to upload news.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUploadNews();
  };

  return (
    <div className="news-admin-dashboard">
      <div className="news-admin-sidebar">
        <button className="news-admin-sidebar-link" onClick={() => navigate("/admin-dashboard")}>
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button className="news-admin-sidebar-link" onClick={() => navigate('/approvals')}>
          <span>✅</span>
          <span>Approvals</span>
        </button>
        <button className="news-admin-sidebar-link" onClick={() => navigate('/add-student')}>
          <span>🎓</span>
          <span>Add New Student</span>
        </button>
        <button className="news-admin-sidebar-link" onClick={() => navigate('/add-teacher')}>
          <span>👨‍🏫</span>
          <span>Add New Teacher</span>
        </button>
        <button className="news-admin-sidebar-link" onClick={() => navigate('/addcourse')}>
          <span>📚</span>
          <span>Allocate Courses</span>
        </button>
        <button className="news-admin-sidebar-link" onClick={() => navigate('/meritlist')}>
          <span>🏆</span>
          <span>See MeritList</span>
        </button>
        <button className="news-admin-sidebar-link news-admin-logout-link" onClick={() => { localStorage.clear(); navigate('/login'); }}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      <div className="news-admin-dashboard-content">
        
        <div className="news-form-container">
          <div className="news-animation-container">
            <Lottie animationData={newsAnimation} style={{ width: 200, height: 200 }} />
          </div>

          
          <form onSubmit={handleSubmit} className="news-form">
            <div className="form-group">
              <label htmlFor="title">📝 News Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter news title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="news-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">📄 News Content</label>
              <textarea
                id="content"
                placeholder="Enter news content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="news-textarea"
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="url">🔗 News URL (Optional)</label>
              <input
                id="url"
                type="url"
                placeholder="Enter news URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="news-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">🖼️ Image URL (Optional)</label>
              <input
                id="imageUrl"
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="news-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">📑 Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="news-select"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="events">Events</option>
                <option value="announcements">Announcements</option>
                <option value="holidays">Holidays</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="datePosted">📅 Date Posted</label>
                <input
                  id="datePosted"
                  type="date"
                  value={datePosted}
                  onChange={(e) => setDatePosted(e.target.value)}
                  className="news-input"
                  required
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="dateExpiry">⏳ Expiry Date</label>
                <input
                  id="dateExpiry"
                  type="date"
                  value={dateExpiry}
                  onChange={(e) => setDateExpiry(e.target.value)}
                  className="news-input"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="news-submit-button"
              disabled={isLoading}
            >
              {isLoading ? "🚀 Uploading..." : "🚀 Upload News"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadNewsPage;
