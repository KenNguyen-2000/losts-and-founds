import React, { useEffect } from 'react';
import loginBanner from '../../assets/images/login-banner.png';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  authActions,
  selectAuthErr,
  selectAuthLoggedIn,
} from '../../redux/auth/auth.slice';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectAuthLoggedIn);
  const error = useAppSelector(selectAuthErr);

  const getGoogleOAuthURL = () => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options: any = {
      redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT,
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  };

  const oauthSignIn = () => {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params: any = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT,
      response_type: 'token',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
      include_granted_scopes: 'true',
      state: 'pass-through value',
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
      let input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  };

  const submitLogin = async (event: any) => {
    event.preventDefault();
    const { email, password } = event.target;

    dispatch(
      authActions.login({ email: email.value, password: password.value })
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/post-list');
    }
  }, [isLoggedIn]);

  return (
    <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
      <div className='w-full max-w-[1000px] max-h-[800px] flex  bg-white shadow-md relative rounded-md overflow-hidden'>
        <h3 className='absolute left-4 top-4 italic text-xs text-gray-600'>
          Lost and Found
        </h3>

        <div className='w-1/2 flex flex-col items-center justify-center py-14 px-14 gap-3'>
          <div className='w-full flex flex-col gap-1 text-center mb-2'>
            <p>{error !== null && error}</p>
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
            <div className='w-full relative'>
              <label
                htmlFor='email'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Email
              </label>
              <div className='w-full relative'>
                <input
                  type='email'
                  name='email'
                  id='email'
                  autoComplete='email'
                  className='mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                  required
                />
                <FontAwesomeIcon
                  icon={solid('envelope')}
                  className='w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2'
                />
              </div>
            </div>

            <div className='w-full'>
              <label
                htmlFor='password'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Password
              </label>
              <div className='w-full relative'>
                <input
                  type='password'
                  name='password'
                  id='password'
                  autoComplete='password'
                  className='mt-2 block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                  required
                />
                <FontAwesomeIcon
                  icon={solid('lock')}
                  className='w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2'
                />
              </div>
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
                  href='/forgot-password'
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
          <div className='w-full px-4 flex items-center gap-4 before:contents-[""] after:contents-[""] before:h-[1px] after:h-[1px] after:w-full before:w-full before:bg-gray-400 after:bg-slate-400 '>
            or
          </div>
          <a
            type='button'
            href={getGoogleOAuthURL()}
            className='w-fit px-6 py-1 bg-transparent border border-gray-500 rounded-lg'
          >
            Sign in with Google
          </a>
        </div>
        <div className='relative  w-1/2'>
          <img
            alt='banner'
            src={loginBanner}
            className='w-full h-full object-cover'
          />
          <div className='absolute bottom-0 right-0 left-0'>
            <div className='w-full text-center text-sm backdrop-brightness-75 py-4 text-white mt-1'>
              Don't have a account?{' '}
              <a
                href='/register'
                className='text-amber-400 underline cursor-pointer'
              >
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
