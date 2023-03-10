import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
 
// import './styles/index.css';
import './styles/posts.css';
import './styles/colors.css';

import Homepage from './pages/Homepage'
import Explore from './pages/Explore';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Admin from './pages/Admin';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* Feeds */}
      <Route path="/" element={<Homepage />} />
      <Route path="/explore" element={<Explore />} />

      {/* People */}
      <Route path="/friends" element={<Friends />} />
      <Route path="/search" element={<Search />} />
      <Route path="/u/:username" element={<Profile />} />

      {/* Messages */}
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:chatroom" element={<Chat />} />

      {/* Posts */}
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:post" element={<Post />} />

      {/* Advertisements */}
      <Route path="/admin" element={<Admin />} />

      {/* Others */}
      <Route path="/settings" element={<Settings />} />

      {/* Admin */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
);