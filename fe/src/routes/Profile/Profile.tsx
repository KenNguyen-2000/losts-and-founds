import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components';
import './Profile.style.scss';
import logo from '../../assets/images/logo.png';
import interceptor from '../../services/interceptor';
import { IUser } from '../../interfaces/user';

const Profile = () => {
  const date: Date = new Date(2000, 9, 29);
  const [userData, setUserData] = useState<IUser>();

  useEffect(() => {
    const data = async () => {
      try {
        const res = await interceptor.get('/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (res.status === 200) {
          setUserData({
            ...res.data.user,
            dob: new Date(res.data.user.dob),
          });
        } else {
          //   console.log(res.data.error);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    data();
  }, []);

  return (
    <div className='flex flex-col min-h-screen '>
      <Navbar />
      <div className='profile__wrapper w-full flex bg-gray-100'>
        <div className='w-[350px] flex-shrink-0 border-collapse border-r-4 border-gray-300 h-screen flex flex-col items-start '>
          <h1 className='text-xl font-semibold py-8 pr-6 pl-[30%]'>
            User Profile
          </h1>
          <ul className='profile-sidebar__wrapper flex flex-col items-start'>
            <li className='profile-sidebar__item w-full flex items-center gap-3 py-3 pl-[30%] cursor-pointer  hover:bg-gray-200 border-r-4 border-amber-400'>
              <FontAwesomeIcon icon={regular('user')} />
              <span>User Info</span>
            </li>
            <li className='profile-sidebar__item w-full flex items-center gap-3 py-3 pl-[30%] cursor-pointer hover:bg-gray-200 hover:border-r-4 hover:border-amber-400 hover:border-opacity-70'>
              <FontAwesomeIcon icon={regular('pen-to-square')} />
              <span>Created Posts</span>
            </li>
          </ul>
        </div>
        <div className='flex-grow flex flex-col px-12 py-10'>
          <div className='overflow-hidden max-w-[900px] bg-white shadow sm:rounded-lg'>
            <div className='px-4 py-5 sm:px-6 flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full border border-gray-200'>
                <img
                  alt='avatar'
                  src={logo}
                  className='w-full h-full object-contain rounded-full'
                />
              </div>
              <div>
                <h3 className='text-base font-semibold leading-6 text-gray-900'>
                  Nguyen Kien
                </h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                  @ngkien299
                </p>
              </div>
            </div>
            <div className='border-t border-gray-200'>
              <dl>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 flex items-center'>
                    <label htmlFor='name' className='text-inherit'>
                      Full name
                    </label>
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      value={userData ? userData.name : 'Margot Foster'}
                      className='w-full p-0 border-none bg-inherit focus:right-0 focus:outline-none cursor-default'
                      readOnly
                    />
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 flex items-center'>
                    <label htmlFor='username' className='text-inherit'>
                      Username
                    </label>
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <input
                      type='text'
                      name='username'
                      id='username'
                      value={userData ? userData.username : 'Backend Developer'}
                      className='w-full p-0 border-none bg-inherit focus:right-0 focus:outline-none cursor-default'
                      readOnly
                    />
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 flex items-center'>
                    <label htmlFor='password' className='text-inherit'>
                      Password
                    </label>
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <input
                      type='password'
                      name='password'
                      id='password'
                      value='12345678'
                      className='w-full border-none p-0 bg-inherit focus:ring-0 focus:outline-none focus:border-none cursor-default'
                      readOnly
                    />
                  </dd>
                </div>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 flex items-center'>
                    <label htmlFor='email' className='text-inherit'>
                      Email address
                    </label>
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <input
                      type='text'
                      id='email'
                      name='email'
                      value='margotfoster@example.com'
                      className='w-full  border-none p-0 bg-inherit focus:ring-0 focus:outline-none focus:border-none cursor-default'
                      readOnly
                    />
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 flex items-center'>
                    <label htmlFor='phoneNumber' className='text-inherit'>
                      Phone Number
                    </label>
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <input
                      type='text'
                      id='phoneNumber'
                      name='phoneNumber'
                      value={userData ? userData.phoneNumber : '+84 0818000299'}
                      className='w-full  border-none p-0 bg-inherit focus:ring-0 focus:outline-none focus:border-none cursor-default'
                      readOnly
                    />
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Date of birth
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <input
                      type='text'
                      id='dob'
                      name='dob'
                      value={
                        userData
                          ? `${userData.dob.getDate()}/${
                              userData.dob.getMonth() + 1
                            }/${userData.dob.getFullYear()}`
                          : `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
                      }
                      className='w-full  border-none p-0 bg-inherit focus:ring-0 focus:outline-none focus:border-none cursor-default'
                      readOnly
                    />
                  </dd>
                </div>
                {/* <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Date of birth
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
                    incididunt cillum culpa consequat. Excepteur qui ipsum
                    aliquip consequat sint. Sit id mollit nulla mollit nostrud
                    in ea officia proident. Irure nostrud pariatur mollit ad
                    adipisicing reprehenderit deserunt qui eu.
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Attachments
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <ul
                      role='list'
                      className='divide-y divide-gray-200 rounded-md border border-gray-200'
                    >
                      <li className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                        <div className='flex w-0 flex-1 items-center'>
                          <svg
                            className='h-5 w-5 flex-shrink-0 text-gray-400'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            aria-hidden='true'
                          >
                            <path
                              fill-rule='evenodd'
                              d='M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z'
                              clip-rule='evenodd'
                            />
                          </svg>
                          <span className='ml-2 w-0 flex-1 truncate'>
                            resume_back_end_developer.pdf
                          </span>
                        </div>
                        <div className='ml-4 flex-shrink-0'>
                          <a
                            href='#'
                            className='font-medium text-indigo-600 hover:text-indigo-500'
                          >
                            Download
                          </a>
                        </div>
                      </li>
                      <li className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                        <div className='flex w-0 flex-1 items-center'>
                          <svg
                            className='h-5 w-5 flex-shrink-0 text-gray-400'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                            aria-hidden='true'
                          >
                            <path
                              fill-rule='evenodd'
                              d='M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z'
                              clip-rule='evenodd'
                            />
                          </svg>
                          <span className='ml-2 w-0 flex-1 truncate'>
                            coverletter_back_end_developer.pdf
                          </span>
                        </div>
                        <div className='ml-4 flex-shrink-0'>
                          <a
                            href='#'
                            className='font-medium text-indigo-600 hover:text-indigo-500'
                          >
                            Download
                          </a>
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div> */}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
