import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { BlogListSkeleton } from "../Skeleton/Skeleton";
import { imageFromBuffer } from "../../utils/imageUtils";
import "./BlogList.css";

const BlogList = () => {
  const [page, setPage] = useState(1);
  const { posts, loading, error, pagination } = usePosts(page, 10);

  const handleImageSrc = (post) => {
    if (post.image) {
      // If image is a URL (from Cloudinary)
      if (typeof post.image === 'string' && post.image.startsWith('http')) {
        return post.image;
      }
      // If image is a base64 data URL
      if (typeof post.image === 'string' && post.image.startsWith('data:')) {
        return post.image;
      }
      // If image is a buffer (old format)
      if (post.image.data || (post.image.type === 'Buffer')) {
        return imageFromBuffer(post.image, post.imageType);
      }
    }
    return null;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="blog-list">
        <h2 className="blog-list-title">Latest Blog Posts</h2>
        <BlogListSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list">
        <h2 className="blog-list-title">Latest Blog Posts</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <h2 className="blog-list-title">Latest Blog Posts</h2>
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No blog posts yet. Be the first to create one!</p>
        </div>
      ) : (
        <>
          <div className="blog-cards-container">
            {posts.map((post) => {
              const imageSrc = handleImageSrc(post);
              return (
                <div key={post._id} className="blog-card">
                  {imageSrc ? (
                    <img 
                      className="blog-card-image" 
                      src={imageSrc} 
                      alt={post.title}
                      loading="lazy"
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
                      <Link to={`/posts/${post._id}`} className="blog-card-read-more">
                        Read More
                      </Link>
                      {post.author && (
                        <span className="blog-card-author">
                          By {post.author.name || 'Anonymous'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {pagination && pagination.totalPages > 1 && (
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
