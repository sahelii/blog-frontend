import React, { useState,useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import './CreateBlog.css';
import { endpoint } from '../../config';
import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [image, setImage] = useState(null);
  const navigate=useNavigate();

  useEffect(()=>{
    if(!auth.currentUser){
      navigate("/login")
    }
  },[])
  
  function getImageFileObject(imageFile) {
    setImage(imageFile);
    console.log("Image Added !")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {

      const token = await auth.currentUser.getIdToken();
      const config = {
      
        headers: {
          'x-auth-token': token,        },
      };
      const formData= new FormData();
      formData.append("title",title);
      formData.append("content",content);
      console.log(image)
      if (image){
        formData.append("fileType",image.file.type)
        formData.append("image",image.file,image.file.name)

      }
      console.log(formData);
      await axios.post(`${endpoint}/api/posts`, formData, config);
      setTitle('');
      setContent('');
      setSuccess('Post created successfully!');
    } catch (err) {
      console.log(err)
      setError('Failed to create the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-card">
        <h2>Create a New Blog Post</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <textarea
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <ImageUploader
      onFileAdded={(img) => getImageFileObject(img)}
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
