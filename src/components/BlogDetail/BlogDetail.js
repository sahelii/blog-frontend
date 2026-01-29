import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePost } from '../../hooks/usePosts';
import { useComments } from '../../hooks/useComments';
import './BlogDetail.css';
import { FaUserAlt, FaClock, FaTag, FaShareAlt, FaEdit, FaTrash } from 'react-icons/fa';
import CommentForm from '../CommentForm/CommentForm';
import { auth } from '../../firebase';
import { format } from 'date-fns';
import { imageFromBuffer } from '../../utils/imageUtils';
import { BlogListSkeleton } from '../Skeleton/Skeleton';
import { calculateReadingTime, sharePost } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { post, loading, error } = usePost(id);
  const { comments, addComment } = useComments(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCommentAdded = async (commentText) => {
    try {
      await addComment(commentText);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = window.location.href;
    const result = await sharePost(post.title, url);
    if (result) {
      showToast(result, 'success');
    } else {
      showToast('Post shared!', 'success');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/api/posts/${id}`);
      showToast('Post deleted successfully', 'success');
      navigate('/my-blogs');
    } catch (err) {
      showToast('Failed to delete post', 'error');
      setDeleting(false);
    }
    setShowDeleteDialog(false);
  };

  // Check if current user is the author by comparing emails
  const isAuthor = post?.author && auth.currentUser && 
    post.author.email?.toLowerCase() === auth.currentUser.email?.toLowerCase();

  if (loading) return <BlogListSkeleton count={1} />;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="loading">Post not found</div>;

  const imageSrc = post.image ? imageFromBuffer(post.image, post.imageType) : null;
  const readingTime = calculateReadingTime(post.content || '');

  return (
    <>
      <div className="blog-detail">
        {imageSrc ? (
          <img
            className="blog-image"
            src={imageSrc}
            alt={post.title}
          />
        ) : (
          <div className="blog-image" />
        )}
        
        <div className="blog-header">
          <h1>{post.title}</h1>
          <div className="blog-actions">
            {isAuthor && (
              <>
                <Link to={`/posts/${id}/edit`} className="blog-action-btn edit-btn">
                  <FaEdit /> Edit
                </Link>
                <button
                  className="blog-action-btn delete-btn"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
            <button className="blog-action-btn share-btn" onClick={handleShare}>
              <FaShareAlt /> Share
            </button>
          </div>
        </div>

        <div className="blog-info">
          <div className="author-info">
            <FaUserAlt className="author-icon" />
            <span>{post.author ? post.author.name : 'Anonymous'}</span>
          </div>
          <div className="blog-meta">
            <span className="blog-meta-item">
              <FaClock /> {readingTime} min read
            </span>
            {post.date && (
              <span className="blog-meta-item">
                {format(new Date(post.date), 'MMMM dd, yyyy')}
              </span>
            )}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="blog-tags">
            {post.tags.map(tag => (
              <span key={tag} className="blog-tag">
                <FaTag /> {tag}
              </span>
            ))}
          </div>
        )}

        <div className="blog-content">
          <p>{post.content}</p>
        </div>

        {auth.currentUser && (
          <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
        )}

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <p>{comment.comment}</p>
                <small>— {comment.user ? comment.user.name : 'Anonymous'}</small>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
    </>
  );
};

export default BlogDetail;
