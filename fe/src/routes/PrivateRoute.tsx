import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { selectAuthLoggedIn } from '../redux/auth/auth.slice';
import { useAppSelector } from '../redux/store';

const PrivateRoute = () => {
  const isLoggedIn = useAppSelector(selectAuthLoggedIn);
  console.log(isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to={'/login'} />;
};

export default PrivateRoute;
