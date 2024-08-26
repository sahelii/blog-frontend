import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaUser, FaBars } from 'react-icons/fa';
import './Sidebar.css';
import { auth } from '../../firebase';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavigation = (path) => {
    if (auth.currentUser) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="sidebar-icons">
        <Link to="/" className="sidebar-icon">
          <FaHome />
          <span className="sidebar-label">Home</span>
        </Link>
        <Link to="/create" className="sidebar-icon">
          <FaPlus />
          <span className="sidebar-label">Create</span>
        </Link>
        <Link to="/my-blogs" className="sidebar-icon">
          <FaUser />
          <span className="sidebar-label">My Blogs</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
