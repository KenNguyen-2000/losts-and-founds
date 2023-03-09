import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router';
import { Login, PostList, Profile, Register } from './routes';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/post-list' element={<PostList />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
