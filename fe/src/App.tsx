import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router';
import { Login, PostList, Profile, Register } from './routes';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route path='/' element={<PrivateRoute />}>
          <Route path='/post-list' element={<PostList />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
