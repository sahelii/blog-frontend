import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { endpoint } from "../../config";
import "./BlogList.css";
import { imagefrombuffer } from "imagefrombuffer";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`${endpoint}/api/posts`);
      setPosts(res.data);
      console.log(res.data);
    };

    fetchPosts()
  }, []);
  return (
    <div className="blog-list">
      <h2 className="blog-list-title">Latest Blog Posts</h2>
      <div className="blog-cards-container">
        {posts.map((post) => (
          <div key={post._id} className="blog-card">
              {post.image? <img className="blog-card-image" src={imagefrombuffer({
          type:post.imageType, // example image/jpeg 
          data:post.image.data, // array buffer data 
        })} />:<div className="blog-card-image"></div>}
            
            <div className="blog-card-content">
              <h3 className="blog-card-title">
                <Link to={`/posts/${post._id}`}>{post.title}</Link>
              </h3>
              <p className="blog-card-excerpt">
                {post.content.length > 150
                  ? post.content.substring(0, 150) + "..."
                  : post.content}
              </p>
              <Link to={`/posts/${post._id}`} className="blog-card-read-more">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
