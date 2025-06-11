import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { login, signUp } from '../../authService';
import { auth } from "../../firebase";
import { deleteUser } from 'firebase/auth';
import { endpoint } from '../../config';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUser, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  
  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const registerUserToBackend = async (name, email, password, firebase_uid) => {
    const registerRoute = `${endpoint}/api/auth/register`;
    const registerData = { name, email, password, firebase_uid };

    try {
      const res = await axios.post(registerRoute, registerData);
      if (res.status === 201) {
        return [true, res.data];
      }
    } catch (err) {
      console.log(err);
      return [false, undefined];
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name');
          return;
        }
        const signup_obj = await signUp(email, password);
        const res = await registerUserToBackend(name, email, password, signup_obj.user.uid);
        if (!res[0]) {
          deleteUser(auth.currentUser);
          setError('Failed to register. Please try again.');
          return;
        }
        const firebase_token = await auth.currentUser.getIdToken();
        saveTokenToLocalStorage(firebase_token);
      } else {
        const login_obj = await login(email, password);
        const firebase_token = await auth.currentUser.getIdToken();
        saveTokenToLocalStorage(firebase_token);
      }
      navigate('/');  
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please log in.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Authentication error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add('hide-sidebar');
    return () => {
      document.body.classList.remove('hide-sidebar');
    };
  }, []);

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="subtitle">{isSignUp ? 'Join our community' : 'Sign in to continue'}</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleAuth}>
            {isSignUp && (
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="input-group" style={{ position: 'relative' }}>
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {!isSignUp && (
              <div className="remember-me-row">
                <label className="remember-me-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  Remember Me
                </label>
              </div>
            )}
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>
          
          <div className="switch-container">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button 
                className="switch-button" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
