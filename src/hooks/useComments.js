import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!postId) {
      return;
    }

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/comments/${postId}/comment`);

        if (response.data.success) {
          setComments(response.data.data);
        } else {
          setComments(response.data || []);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch comments';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, showToast]);

  const addComment = async (commentText) => {
    try {
      const response = await api.post(`/api/comments/${postId}/comment`, {
        comment: commentText,
      });

      if (response.data.success) {
        const newComment = response.data.data;
        setComments(prev => [...prev, newComment]);
        showToast('Comment added successfully', 'success');
        return newComment;
      } else {
        setComments(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add comment';
      showToast(errorMessage, 'error');
      throw err;
    }
  };

  return { comments, loading, error, addComment };
};
