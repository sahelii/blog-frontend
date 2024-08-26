import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import BlogList from './components/BlogList/BlogList';
import BlogDetail from './components/BlogDetail/BlogDetail';
import Sidebar from './components/Sidebar/Sidebar';
import CreateBlog from './components/CreateBlog/CreateBlog';
import MyBlogs from './components/MyBlogs/MyBlogs'; 
import Header from './components/Header/Header';
import { auth } from './firebase';
import './styles.css';
import './App.css';

function App() {

  return (
    <Router>
       <Header/>
      <div className="app-container">
         <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/posts/:id" element={<BlogDetail />} />
             
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
     
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
