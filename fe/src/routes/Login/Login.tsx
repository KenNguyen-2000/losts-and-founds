import React, { useEffect } from 'react';
import loginBanner from '../../assets/images/login-banner.png';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { authActions, selectAuthLoggedIn } from '../../redux/auth/auth.slice';
import { useNavigate } from 'react-router';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectAuthLoggedIn);

  const submitLogin = async (event: any) => {
    event.preventDefault();
    const { username, password } = event.target;

    dispatch(
      authActions.login({ username: username.value, password: password.value })
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/post-list');
    }
  }, [isLoggedIn]);

  return (
    <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
      <div className='w-[1000px] flex bg-white shadow-md relative rounded-md overflow-hidden'>
        <h3 className='absolute left-4 top-4 italic text-xs text-gray-600'>
          Lost and Found
        </h3>

        <div className='flex-grow flex flex-col items-start justify-center px-14'>
          <div className='w-full flex flex-col gap-1 text-center mb-8'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              Sign in to your account
            </h1>
            <p className='text-gray-400 text-sm'>
              The faster you fill up, the faster you get posts
            </p>
          </div>
          <form
            onSubmit={submitLogin}
            className='w-full flex flex-col items-start gap-6'
          >
            <div className='w-full'>
              <label
                htmlFor='username'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Username
              </label>
              <input
                type='text'
                name='username'
                id='username'
                autoComplete='username'
                className='mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                required
              />
            </div>

            <div className='w-full'>
              <label
                htmlFor='password'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                autoComplete='password'
                className='mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                required
              />
            </div>

            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900 cursor-pointer'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-amber-600 hover:text-amber-500'
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <button
              type='submit'
              className='w-full inline-flex justify-center rounded-md bg-amber-500 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400'
            >
              Login
            </button>
          </form>
          <div className='w-full text-center text-sm text-gray-500 mt-1'>
            Don't have a account?{' '}
            <a
              href='/register'
              className='text-indigo-500 underline cursor-pointer'
            >
              Register
            </a>
          </div>
        </div>
        <div className='w-1/2'>
          <img
            alt='banner'
            src={loginBanner}
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
