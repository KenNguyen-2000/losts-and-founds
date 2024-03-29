import React from 'react';
import './App.scss';
import { Routes, Route } from 'react-router';
import {
  AuctionPosts,
  ChangePassword,
  ForgotPassword,
  Login,
  PostList,
  Profile,
  Register,
  VerifyOtp,
} from './routes';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import LayoutedPage from './components/LayoutedPage/LayoutedPage';
import Notfound from './routes/Notfound/Notfound';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<PublicRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-otp/:otpId' element={<VerifyOtp />} />
          <Route path='/change-password' element={<ChangePassword />} />
        </Route>
        <Route path='/' element={<PrivateRoute />}>
          <Route index element={<LayoutedPage component={<PostList />} />} />
          <Route
            path='/post-list'
            element={<LayoutedPage component={<PostList />} />}
          />
          <Route
            path='/post-list/losts'
            element={
              <LayoutedPage component={<PostList typePost={'lost'} />} />
            }
          />
          <Route
            path='/post-list/founds'
            element={<LayoutedPage component={<PostList typePost='found' />} />}
          />
          <Route
            path='/post-list/auction'
            element={<LayoutedPage component={<AuctionPosts />} />}
          />
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='*' element={<Notfound />} />
      </Routes>
    </div>
  );
}

export default App;
