import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';
import Login from './components/Login/Login';
import BlogList from './components/BlogList/BlogList';
import BlogDetail from './components/BlogDetail/BlogDetail';
import Sidebar from './components/Sidebar/Sidebar';
import CreateBlog from './components/CreateBlog/CreateBlog';
import MyBlogs from './components/MyBlogs/MyBlogs'; 
import Header from './components/Header/Header';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import './styles.css';
import './App.css';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
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
          </ToastProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
