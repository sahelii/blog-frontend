import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { BlogListSkeleton } from '../Skeleton/Skeleton';
import { imageFromBuffer } from '../../utils/imageUtils';
import { calculateReadingTime, formatRelativeTime } from '../../utils/helpers';
import './BlogList.css';
import { FaClock, FaTag } from 'react-icons/fa';

const BlogList = ({ searchTerm: propSearchTerm = '' }) => {
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  // Use 12 items per page (multiple of 3) to fill rows properly in 3-column grid
  const { posts, loading, error, pagination } = usePosts(page, 12);

  // Use prop search term if provided, otherwise use local state
  const searchTerm = propSearchTerm || '';

  const handleImageSrc = (post) => {
    if (post.image) {
      if (typeof post.image === 'string' && post.image.startsWith('http')) {
        return post.image;
      }
      if (typeof post.image === 'string' && post.image.startsWith('data:')) {
        return post.image;
      }
      if (post.image.data || (post.image.type === 'Buffer')) {
        return imageFromBuffer(post.image, post.imageType);
      }
    }
    return null;
  };

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.author?.name?.toLowerCase().includes(searchLower),
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(selectedTag),
      );
    }

    return filtered;
  }, [posts, searchTerm, selectedTag]);

  if (loading && posts.length === 0) {
    return (
      <div className="blog-list">
        <div className="blog-list-header">
          <h1 className="blog-list-title">Discover Stories</h1>
          <p className="blog-list-subtitle">Explore amazing content from our community</p>
        </div>
        <BlogListSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list">
        <div className="blog-list-header">
          <h1 className="blog-list-title">Discover Stories</h1>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <div className="blog-list-header">
        <h1 className="blog-list-title">Discover Stories</h1>
        <p className="blog-list-subtitle">Explore amazing content from our community</p>
      </div>

      {/* Tag Filter Section - Only show if there are tags */}
      {allTags.length > 0 && (
        <div className="blog-list-controls">
          <div className="tags-filter">
            <button
              className={`tag-filter-btn ${selectedTag === '' ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                <FaTag /> {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No stories found</h3>
            <p>
              {searchTerm || selectedTag
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to share your story with the world!'}
            </p>
            {!searchTerm && !selectedTag && (
              <Link to="/create" className="empty-state-cta">
                Write Your First Story
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="blog-cards-container">
            {filteredPosts.map((post) => {
              const imageSrc = handleImageSrc(post);
              const readingTime = calculateReadingTime(post.content || '');
              return (
                <div key={post._id} className="blog-card">
                  {imageSrc ? (
                    <Link to={`/posts/${post._id}`} className="blog-card-image-wrapper">
                      <img
                        className="blog-card-image"
                        src={imageSrc}
                        alt={post.title}
                        loading="lazy"
                      />
                    </Link>
                  ) : (
                    <Link to={`/posts/${post._id}`} className="blog-card-image-wrapper">
                      <div className="blog-card-image-placeholder"></div>
                    </Link>
                  )}
                  <div className="blog-card-content">
                    {post.tags && post.tags.length > 0 && (
                      <div className="blog-card-tags">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="blog-tag">
                            <FaTag /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="blog-card-title">
                      <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-card-excerpt">
                      {post.content.length > 200
                        ? `${post.content.substring(0, 200)}...`
                        : post.content}
                    </p>
                    <div className="blog-card-footer">
                      <div className="blog-card-meta">
                        {post.author && (
                          <span className="blog-card-author">
                            {post.author.name || 'Anonymous'}
                          </span>
                        )}
                        <span className="blog-card-reading-time">
                          <FaClock /> {readingTime} min
                        </span>
                        {post.date && (
                          <span className="blog-card-date">
                            {formatRelativeTime(post.date)}
                          </span>
                        )}
                      </div>
                      <Link to={`/posts/${post._id}`} className="blog-card-read-more">
                        Read Story →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!searchTerm && !selectedTag && pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!pagination.hasNextPage}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
