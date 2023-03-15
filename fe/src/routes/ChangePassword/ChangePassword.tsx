import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  authActions,
  selectAuthErr,
  selectAuthLoading,
  selectAuthSuccess,
  selectOtp,
} from '../../redux/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import banner from '../../assets/images/3293465.jpg';
import { useQuery } from '../../hooks/useQuery';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthErr);
  const success = useAppSelector(selectAuthSuccess);
  const otpData = useAppSelector(selectOtp);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassowrd, setConfirmPassword] = useState('');
  const query = useQuery();
  const email = query.get('email');

  const handleSendOtp = async () => {
    dispatch(
      authActions.changeNewPassword({
        newPassword: newPassword,
        email: email as string,
      })
    );
  };
  return (
    <div className='h-screen w-full flex items-center justify-center bg-gray-100'>
      <div className='flex flex-col gap-1 items-center py-4 px-6 bg-white rounded-lg border border-gray-200'>
        <h1 className='font-semibold'>Password recovery</h1>

        <img
          src={banner}
          alt='banner'
          className='w-[300px] h-auto object-contain'
        />
        <div className='text-xl  text-center font-semibold -mt-14'>
          <h2>Lost your password?</h2>
          <h2>Enter your details to recover</h2>
        </div>
        <span className='text-sm text-gray-300 my-1'>
          Enter your details to proceed further
        </span>
        <div className='w-full'>
          <label
            htmlFor='new-password'
            className='block text-sm font-medium mt-2 text-gray-900'
          >
            New password:
          </label>
          <input
            type='password'
            name='new-password'
            id='new-password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6'
            minLength={6}
            required
          />
        </div>
        <div className='w-full'>
          <label
            htmlFor='confirm-password'
            className='block text-sm font-medium mt-2 text-gray-900'
          >
            Confirm password:
          </label>
          <input
            type='password'
            name='confirm-password'
            id='confirm-password'
            value={confirmPassowrd}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6'
            minLength={6}
            required
          />
        </div>
        <div className='w-full bg-gray-50 py-3 text-right'>
          <button
            onClick={handleSendOtp}
            type='button'
            className='w-full flex items-center justify-center rounded-md bg-amber-500 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400'
            disabled={
              newPassword !== confirmPassowrd ||
              newPassword === '' ||
              confirmPassowrd === ''
            }
          >
            {loading ? (
              <svg
                className='animate-spin h-6 w-6 mr-3 border-4 border-transparent border-t-white rounded-full'
                viewBox='0 0 24 24'
              ></svg>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
        {error && (
          <div className='w-full text-center text-sm py-1 border-2 border-red-500 bg-red-200 text-red-500 font-medium'>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
