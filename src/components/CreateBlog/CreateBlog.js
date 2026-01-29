import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './CreateBlog.css';
import { endpoint } from '../../config';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';
import { useToast } from '../../context/ToastContext';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  function getImageFileObject(imageFile) {
    setImage(imageFile);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (content.length < 50) {
      setError('Content must be at least 50 characters long');
      setLoading(false);
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (tagsArray.length > 0) {
        formData.append("tags", JSON.stringify(tagsArray));
      }

      if (image) {
        formData.append("fileType", image.file.type);
        formData.append("image", image.file, image.file.name);
      }

      await axios.post(`${endpoint}/api/posts`, formData, config);
      setTitle('');
      setContent('');
      setTags('');
      setImage(null);
      setSuccess('Post created successfully!');
      showToast('Post created successfully!', 'success');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError('Failed to create the post. Please try again.');
      showToast('Failed to create post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-card">
        <h2>Create a New Blog Post</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
            <span className="char-count">{title.length}/200</span>
          </div>
          <div className="input-group">
            <textarea
              placeholder="Write your content here... (minimum 50 characters)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={50}
            />
            <span className="char-count">
              {content.length} characters {content.length < 50 && `(${50 - content.length} more needed)`}
            </span>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tags (comma separated, e.g., tech, programming, web)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <span className="char-count">
              {tags.split(',').filter(t => t.trim().length > 0).length} tag(s)
            </span>
          </div>
          <ImageUploader
            onFileAdded={(img) => getImageFileObject(img)}
          />
          <button type="submit" disabled={loading || content.length < 50} className="submit-button">
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
