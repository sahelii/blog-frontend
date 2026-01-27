import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import "./CommentForm.css";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/api/comments/${postId}/comment`, {
        comment: comment.trim()
      });
      
      const commentText = comment.trim();
      setComment('');
      
      // Handle both new and old API response formats
      const newComment = response.data.success ? response.data.data : response.data;
      
      // Call callback with comment text (as expected by BlogDetail's addComment)
      if (onCommentAdded) {
        await onCommentAdded(commentText);
      }
      
      showToast('Comment added successfully', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add comment';
      showToast(errorMessage, 'error');
      console.error('Failed to add comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-text-area"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        required
        disabled={loading}
      />
      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default CommentForm;
