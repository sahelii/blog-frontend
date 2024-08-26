import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { login, signUp } from '../../authService';
import { auth } from "../../firebase";
import { deleteUser } from 'firebase/auth';
import { endpoint } from '../../config';
import axios from 'axios';
import './Login.css';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const registerUserToBackend = async (name,email, password, firebase_uid) => {
    const registerRoute = `${endpoint}/api/auth/register`;
    const registerData = {name,email, password, firebase_uid };

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

  const handleAuth = async () => {
    try {
      setError('');
      if (isSignUp) {
        const signup_obj = await signUp(email, password);
        const res = await registerUserToBackend(name,email, password, signup_obj.user.uid);
        if (!res[0]) {
          deleteUser(auth.currentUser);
        }
        const firebase_token = await auth.currentUser.getIdToken();
        saveTokenToLocalStorage(firebase_token);
      } else {
        const login_obj = await login(email, password);
        const firebase_token = await auth.currentUser.getIdToken();
        saveTokenToLocalStorage(firebase_token);
      }
      navigate('/');  // Redirect to the BlogList page after successful login/signup
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use. Please log in.');
      } else {
        setError('Authentication error: ' + error.message);
      }
    }
  };

  return (
    <div className="login-form">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isSignUp? <input
        type="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />:<></>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>
        {isSignUp ? 'Sign Up' : 'Login'}
      </button>
      <button className="switch-button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
      </button>
    </div>
  );
};

export default Login;
