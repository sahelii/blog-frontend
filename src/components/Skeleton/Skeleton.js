import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type = 'text', width, height, className = '' }) => {
  const classes = `skeleton skeleton-${type} ${className}`;
  const style = {};
  
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={classes}
      style={style}
      aria-label="Loading..."
    />
  );
};

export const BlogCardSkeleton = () => (
  <div className="blog-card-skeleton">
    <Skeleton type="image" height="200px" />
    <div className="skeleton-content">
      <Skeleton type="title" width="80%" />
      <Skeleton type="text" width="100%" />
      <Skeleton type="text" width="60%" />
    </div>
  </div>
);

export const BlogListSkeleton = ({ count = 6 }) => (
  <div className="blog-list-skeleton">
    {Array.from({ length: count }).map((_, i) => (
      <BlogCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
