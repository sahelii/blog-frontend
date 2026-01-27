import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const usePosts = (page = 1, limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/posts', {
          params: { page, limit }
        });
        
        if (response.data.success) {
          setPosts(response.data.data);
          setPagination(response.data.pagination);
        } else {
          setPosts(response.data.data || []);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch posts';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit, showToast]);

  return { posts, loading, error, pagination };
};

export const usePost = (id) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/posts/${id}`);
        
        if (response.data.success) {
          setPost(response.data.data);
        } else {
          setPost(response.data);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch post';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, showToast]);

  return { post, loading, error };
};

export const useMyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/posts/my-blogs');
        
        if (response.data.success) {
          setPosts(response.data.data);
        } else {
          setPosts(response.data.data || []);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your posts';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [showToast]);

  return { posts, loading, error, refetch: () => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/posts/my-blogs');
        if (response.data.success) {
          setPosts(response.data.data);
        } else {
          setPosts(response.data.data || []);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your posts';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }};
};
