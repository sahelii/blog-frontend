import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Header.css';
import { FaPen, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const Header = ({ onSearch }) => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');  
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">✍️</span>
        <span className="logo-text">StoryHub</span>
      </Link>
      
      {/* Search Bar - Only show on home page or when focused */}
      {(location.pathname === '/' || isSearchFocused) && (
        <div className={`header-search ${isSearchFocused ? 'focused' : ''}`}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={() => setIsSearchFocused(false)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => {
                setSearchTerm('');
                if (onSearch) onSearch('');
              }}
            >
              ×
            </button>
          )}
        </div>
      )}
      
      <nav className="main-nav">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
        >
          Discover
        </Link>
        {user && (
          <>
            <Link 
              to="/create" 
              className={`nav-link ${isActive('/create') ? 'active' : ''}`}
            >
              <FaPen /> Write
            </Link>
            <Link 
              to="/my-blogs" 
              className={`nav-link ${isActive('/my-blogs') ? 'active' : ''}`}
            >
              My Stories
            </Link>
          </>
        )}
      </nav>

      <div className="header-actions">
        {user ? (
          <div className="user-menu">
            <div className="user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <div className="avatar-placeholder">
                  {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="user-dropdown">
              <div className="user-name">{user.displayName || user.email?.split('@')[0] || 'User'}</div>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-link">Sign In</Link>
            <Link to="/signup" className="auth-link primary-btn">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
