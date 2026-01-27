import React from 'react';
import { useParams } from 'react-router-dom';
import { usePost } from '../../hooks/usePosts';
import { useComments } from '../../hooks/useComments';
import './BlogDetail.css';
import { FaUserAlt } from 'react-icons/fa';
import CommentForm from '../CommentForm/CommentForm';
import { auth } from '../../firebase';
import { format } from 'date-fns';
import { imageFromBuffer } from '../../utils/imageUtils';
import { BlogListSkeleton } from '../Skeleton/Skeleton';

const BlogDetail = () => {
  const { id } = useParams();
  const { post, loading, error } = usePost(id);
  const { comments, addComment } = useComments(id);

  const handleCommentAdded = async (commentText) => {
    try {
      await addComment(commentText);
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (loading) return <BlogListSkeleton count={1} />;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="loading">Post not found</div>;

  const imageSrc = post.image ? imageFromBuffer(post.image, post.imageType) : null;

  return (
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
      <h1>{post.title}</h1>
      <div className="blog-info">
        <div className="author-info">
          <FaUserAlt className="author-icon" />
          <span>{post.author ? post.author.name : 'Anonymous'}</span>
        </div>
        <div className="date-info">
          <span>
            {post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : 'Invalid Date'}
          </span>
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
              <small>— {comment.user? comment.user.name : 'Anonymous'}</small>
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
