import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import axios from 'axios';
import { endpoint } from '../../config';
import { useToast } from '../../context/ToastContext';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(`${endpoint}/api/posts/${id}`, {
          headers: { 'x-auth-token': token },
        });

        const post = response.data.data || response.data;
        setTitle(post.title || '');
        setContent(post.content || '');
        setTags(post.tags ? post.tags.join(', ') : '');
        setLoading(false);
      } catch (err) {
        setError('Failed to load post');
        showToast('Failed to load post', 'error');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      formData.append('tags', JSON.stringify(tagsArray));

      if (image) {
        formData.append('fileType', image.file.type);
        formData.append('image', image.file, image.file.name);
      }

      await axios.put(`${endpoint}/api/posts/${id}`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('Post updated successfully!', 'success');
      navigate(`/posts/${id}`);
    } catch (err) {
      setError('Failed to update post. Please try again.');
      showToast('Failed to update post', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="edit-post-container">
      <div className="edit-post-card">
        <h2>Edit Post</h2>
        {error && <div className="error-message">{error}</div>}
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
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={50}
            />
            <span className="char-count">{content.length} characters</span>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tags (comma separated, e.g., tech, programming, web)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <ImageUploader onFileAdded={(img) => setImage(img)} />
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="submit-button">
              {saving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
