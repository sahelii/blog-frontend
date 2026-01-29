import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './MyBlogs.css';
import { endpoint } from '../../config';
import { imageFromBuffer } from '../../utils/imageUtils';
import { calculateReadingTime, formatRelativeTime } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, postId: null });
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        const res = await axios.get(`${endpoint}/api/posts/my-blogs`, config);
        setPosts(res.data.data || res.data || []);
      } catch (err) {
        setError('Failed to fetch your blogs. Please try again.');
        showToast('Failed to fetch your blogs', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) {
      fetchMyPosts();
    }
  }, [navigate, showToast]);

  const handleDelete = async () => {
    if (!deleteDialog.postId) return;
    
    setDeleting(true);
    try {
      await api.delete(`/api/posts/${deleteDialog.postId}`);
      setPosts(posts.filter(p => p._id !== deleteDialog.postId));
      showToast('Post deleted successfully', 'success');
      setDeleteDialog({ isOpen: false, postId: null });
    } catch (err) {
      showToast('Failed to delete post', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading-message">Loading your blogs...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <div className="blog-list">
        <h2 className="blog-list-title">Your Blog Posts</h2>
        <div className="blog-cards-container">
          {posts.length > 0 ? (
            posts.map(post => {
              const imageSrc = post.image ? imageFromBuffer(post.image, post.imageType) : null;
              const readingTime = calculateReadingTime(post.content || '');
              return (
                <div key={post._id} className="blog-card">
                  {imageSrc ? (
                    <img 
                      className="blog-card-image" 
                      src={imageSrc}
                      alt={post.title}
                    />
                  ) : (
                    <div className="blog-card-image"></div>
                  )}
                  <div className="blog-card-content">
                    <h3 className="blog-card-title">
                      <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-card-excerpt">
                      {post.content.length > 150
                        ? post.content.substring(0, 150) + "..."
                        : post.content}
                    </p>
                    <div className="blog-card-footer">
                      <div className="blog-card-meta">
                        <span className="blog-card-reading-time">
                          <FaClock /> {readingTime} min read
                        </span>
                        {post.date && (
                          <span className="blog-card-date">
                            {formatRelativeTime(post.date)}
                          </span>
                        )}
                      </div>
                      <div className="blog-card-actions">
                        <Link to={`/posts/${post._id}/edit`} className="blog-action-link edit">
                          <FaEdit /> Edit
                        </Link>
                        <button
                          className="blog-action-link delete"
                          onClick={() => setDeleteDialog({ isOpen: true, postId: post._id })}
                        >
                          <FaTrash /> Delete
                        </button>
                        <Link to={`/posts/${post._id}`} className="blog-card-read-more">
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-posts">
              <div className="empty-state">
                <h3>No posts yet</h3>
                <p>Start sharing your thoughts with the world!</p>
                <Link to="/create" className="empty-state-cta">
                  Create Your First Post
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, postId: null })}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
    </>
  );
};

export default MyBlogs;
