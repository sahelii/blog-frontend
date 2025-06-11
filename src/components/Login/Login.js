import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { login, signUp } from '../../authService';
import { auth } from "../../firebase";
import { deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { endpoint } from '../../config';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUser, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent!');
      setShowReset(false);
      setResetEmail('');
    } catch (err) {
      toast.error('Failed to send reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'Weak';
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8) return 'Strong';
    return 'Medium';
  };

  useEffect(() => {
    document.body.classList.add('hide-sidebar');
    return () => {
      document.body.classList.remove('hide-sidebar');
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/signup') setIsSignUp(true);
    else if (location.pathname === '/login') setIsSignUp(false);
  }, [location.pathname]);

  return (
    <div className="login-bg animated-bg">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo" style={{marginBottom: '1.2em'}}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#ef476f"/>
              <path d="M14 34V14H34V34H14Z" fill="#fff"/>
              <path d="M24 18V30" stroke="#ef476f" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M18 24H30" stroke="#ef476f" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="subtitle">{isSignUp ? 'Join our community' : 'Sign in to continue'}</p>
          <p className="tagline">Share your story with the world.</p>
          
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (isSignUp) setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
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
            
            {isSignUp && password && (
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>{passwordStrength} Password</div>
            )}
            
            {!isSignUp && (
              <>
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
                <div className="forgot-row">
                  <button type="button" className="forgot-link" onClick={() => setShowReset(true)} disabled={loading}>Forgot Password?</button>
                </div>
              </>
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
        {showReset && (
          <div className="reset-modal">
            <form onSubmit={handlePasswordReset} className="reset-form">
              <h4>Reset Password</h4>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                disabled={resetLoading}
              />
              <button type="submit" disabled={resetLoading} className="submit-button">
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
              </button>
              <button type="button" className="switch-button" onClick={() => setShowReset(false)} disabled={resetLoading}>Cancel</button>
            </form>
          </div>
        )}
        <ToastContainer position="top-center" autoClose={2500} />
      </div>
    </div>
  );
};

export default Login;
