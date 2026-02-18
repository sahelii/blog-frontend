import React, { useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './CommentForm.css';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || loading) {
      return;
    }

    const commentText = comment.trim();
    setComment('');
    setLoading(true);
    
    try {
      // Only call the callback - useComments.addComment will handle the API call
      if (onCommentAdded) {
        await onCommentAdded(commentText);
      } else {
        // Fallback: if no callback, call API directly (shouldn't happen in normal flow)
        await api.post(`/api/comments/${postId}/comment`, {
          comment: commentText,
        });
        showToast('Comment added successfully', 'success');
      }
    } catch (err) {
      // Restore comment text on error
      setComment(commentText);
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
