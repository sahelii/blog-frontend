// BlogDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogDetail.css';
import { endpoint } from '../../config';
import { FaUserAlt } from 'react-icons/fa';
import CommentForm from '../CommentForm/CommentForm';
import { auth } from '../../firebase';
import { format } from 'date-fns';
import { imagefrombuffer } from 'imagefrombuffer';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${endpoint}/api/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${endpoint}/api/comments/${id}/comment`);
        setComments(res.data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  if (!post) return <div className="loading">Loading...</div>;

  return (
    <div className="blog-detail">
      {post.image? <img className='blog-image' src={imagefrombuffer({
          type:post.imageType, // example image/jpeg 
          data:post.image.data, // array buffer data 
        })}/>:<div className='blog-image'/>}
      <h1>{post.title}</h1>
      <div className="blog-info">
        <div className="author-info">
          <FaUserAlt className="author-icon" />
          <span>{post.author ? post.author.name : 'Anonymous'}</span>
        </div>
        <div className="date-info">
          <span>{post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : 'Invalid Date'}</span>
        </div>
      </div>
      <div className="blog-content">
        <p>{post.content}</p>
      </div>
      
      {auth.currentUser && (
        <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
      )}

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <p>{comment.comment}</p>
              <small>— {comment.user.email}</small>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
