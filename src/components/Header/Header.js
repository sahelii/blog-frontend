import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Header.css';

const Header = () => {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');  
      console.log('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">BlogApp</Link>
      <nav>
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/signup" className="auth-link join-btn">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
