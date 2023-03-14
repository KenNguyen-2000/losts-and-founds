import React from 'react';
import loginBanner from '../../assets/images/login-banner.png';
import axios from 'axios';
import interceptor from '../../services/interceptor';
import { useNavigate } from 'react-router';
const today = new Date();
const Register = () => {
  const navigate = useNavigate();

  const submitRegister = async (event: any) => {
    event.preventDefault();
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      dob,
    } = event.target;
    const dateOfBirth = new Date(dob.value);
    if (password.value !== confirmPassword.value) {
      return alert("don't match");
    }

    if (today.getFullYear() - dateOfBirth.getFullYear() < 18) {
      return alert('Children not allowed');
    }

    const res = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/users/register`,
      {
        email: email.value,
        password: password.value,
        name: `${firstName.value} ${lastName.value}`,
        phoneNumber: phoneNumber.value,
        dob: dateOfBirth.getTime(),
      }
    );
    if (res.status === 200) {
      navigate('/login');
    }
  };

  return (
    <div className='w-full h-screen flex justify-center items-center bg-gray-100'>
      <div className='min-w-[1000px] max-w-[1200px] flex bg-white shadow-md relative rounded-md overflow-hidden'>
        <h3 className='absolute right-4 top-4 italic text-xs text-gray-600'>
          Lost and Found
        </h3>
        <div className='w-1/2 relative'>
          <img
            alt='banner'
            src={loginBanner}
            className='w-full h-full object-cover'
          />
          <div className='absolute bottom-0 right-0 left-0'>
            <div className='w-full text-center text-sm backdrop-brightness-75 py-4 text-white mt-1'>
              Already have a account?{' '}
              <a
                href='/login'
                className='text-amber-400 underline cursor-pointer'
              >
                Login
              </a>
            </div>
          </div>
        </div>
        <div className='flex-grow flex flex-col items-start justify-center px-14 py-9'>
          <div className='w-full flex flex-col gap-1 text-center mb-6'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              Sign up for an account
            </h1>
            <p className='text-gray-400 text-sm'>
              The faster you fill up, the faster you get posts
            </p>
          </div>

          <form
            onSubmit={submitRegister}
            className='w-full flex flex-col items-start gap-4'
          >
            <div className='w-full flex gap-3'>
              <div className='w-1/2'>
                <label
                  htmlFor='firstName'
                  className='block text-base font-medium leading-6 text-gray-900'
                >
                  First Name
                </label>
                <input
                  type='text'
                  name='firstName'
                  id='firstName'
                  autoComplete='off'
                  className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                  minLength={2}
                  maxLength={20}
                  required
                />
              </div>
              <div className='w-1/2'>
                <label
                  htmlFor='lastName'
                  className='block text-base font-medium leading-6 text-gray-900'
                >
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  id='lastName'
                  autoComplete='off'
                  className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                  minLength={2}
                  maxLength={20}
                  required
                />
              </div>
            </div>
            <div className='w-full'>
              <label
                htmlFor='email'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Email
              </label>
              <input
                type='text'
                name='email'
                id='email'
                autoComplete='off'
                className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                minLength={5}
                maxLength={20}
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
                autoComplete='off'
                className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                minLength={6}
                required
              />
            </div>
            <div className='w-full'>
              <label
                htmlFor='confirmPassword'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Confirm password
              </label>
              <input
                type='password'
                name='confirmPassword'
                id='confirmPassword'
                autoComplete='off'
                className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                minLength={6}
                required
              />
            </div>
            <div className='w-full'>
              <label
                htmlFor='phoneNumber'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Phone number
              </label>
              <input
                type='text'
                name='phoneNumber'
                id='phoneNumber'
                autoComplete='off'
                className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                minLength={10}
                maxLength={11}
                required
              />
            </div>
            <div className='w-full'>
              <label
                htmlFor='dob'
                className='block text-base font-medium leading-6 text-gray-900'
              >
                Date of birth
              </label>
              <input
                type='date'
                name='dob'
                id='dob'
                autoComplete='off'
                className='mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full inline-flex justify-center rounded-md bg-amber-500 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400'
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
