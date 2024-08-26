import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './MyBlogs.css';
import { endpoint } from '../../config';
import { imagefrombuffer } from 'imagefrombuffer';

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        setPosts(res.data);
      } catch (err) {
        setError('Failed to fetch your blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  if (loading) return <div className="loading-message">Loading your blogs...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="blog-list">
      <h2 className="blog-list-title">Your Blog Posts</h2>
      <div className="blog-cards-container">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="blog-card">
              {post.image ? (
                <img className="blog-card-image" src={imagefrombuffer({
                  type:post.imageType, // example image/jpeg 
                  data:post.image.data, // array buffer data 
                })} />
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
                <Link to={`/posts/${post._id}`} className="blog-card-read-more">
                  Read More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="no-blogs-message">You haven't created any blogs yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
