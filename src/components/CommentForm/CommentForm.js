import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';
import { endpoint } from '../../config';
import "./CommentForm.css";

const CommentForm = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.post(
          `${endpoint}/api/comments/${postId}/comment`, 
          {
            comment: comment,  
          },
          config
        );
        setComment('');
        onCommentAdded(res.data);  
      } catch (err) {
        console.error('Failed to add comment:', err);
      }
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
      />
      <button className="submit-button" type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
