import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Posts from './components/Posts';
import Post from './components/Post';
import NewPost from './components/NewPost';
import LoginAndRegister from './components/LoginAndRegister';
import AdminHomePage from './components/Admin/AdminHomePage'
import { AuthProvider } from './AuthContext';
import VerifyPostsPage from './components/Admin/VerifyPostsPage';
import UsersPage from './components/Admin/UsersPage';
import TeamHome from './components/Team/TeamHome';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard/>} /> 
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/login" element={<LoginAndRegister />} />
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/verify-posts" element={<VerifyPostsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/team/home" element={<TeamHome />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;