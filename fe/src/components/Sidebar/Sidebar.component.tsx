import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../redux/store';
import './Sidebar.style.scss';
import { authActions } from '../../redux/auth/auth.slice';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { postActions } from '../../redux/post/postSlice';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const currentLocation = window.location.href.split('/').slice(3, 5).join('/');
  const userInfo: any = jwtDecode(Cookies.get('accessToken') as string);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <div className='min-w-[300px] md:w-[400px] flex flex-col items-start border-b    py-8 gap-8 bg-white border-r border-gray-200 drop-shadow-md '>
      <div
        className='flex gap-2 h-10 items-center cursor-pointer px-8'
        onClick={() => navigate('/post-list')}
      >
        <img alt='logo' src={logo} className='h-full w-auto object-cover' />
        <h2 className='logo__title whitespace-nowrap text-lg font-bold'>
          Lost and Found
        </h2>
      </div>
      <div className='flex gap-2 px-7'>
        <div className='relative'>
          <div
            className='flex gap-3 items-stretch cursor-pointer'
            onClick={() => setIsAvatarOpen(!isAvatarOpen)}
          >
            <div className='w-12 h-12  rounded-full overflow-hidden'>
              <img
                alt='user avatar'
                src={userInfo.avatarUrl}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='flex flex-col justify-between'>
              <div>{userInfo.name}</div>
              <div className='text-sm text-gray-500'>@{userInfo.email}</div>
            </div>
          </div>
          <ul
            className={`w-full h-24 bg-white rounded-lg border border-gray-200 drop-shadow-xl absolute top-full right-0 left-0 mt-2 flex flex-col justify-evenly py-1 overflow-hidden z-10 transition-all duration-200 ease-in-out scale-0  ${
              isAvatarOpen ? 'scale-100' : ''
            } `}
          >
            <li
              className='hover:bg-slate-300 px-3 py-2 cursor-pointer'
              onClick={() => navigate('/profile')}
            >
              Profile
            </li>
            <li
              className='hover:bg-slate-300 px-3 py-2 cursor-pointer'
              onClick={handleLogout}
            >
              Log out
            </li>
          </ul>
        </div>
      </div>
      <div className='w-full flex flex-col gap-4'>
        {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
        <a
          href='/post-list/losts'
          className={`navbar__nav-item px-8 py-4 text-sm font-medium  ${
            currentLocation === 'post-list/losts' ? 'active__nav' : ''
          }`}
          aria-current='page'
        >
          Lost
        </a>

        <a
          href='/post-list/founds'
          className={`navbar__nav-item relative px-8 py-4 text-sm font-medium  ${
            currentLocation === 'post-list/founds' ? 'active__nav' : ''
          }`}
          aria-current='page'
        >
          Found
        </a>

        <a
          href='/post-list/auction'
          className={`navbar__nav-item relative px-8 py-4 text-sm font-medium  ${
            currentLocation === 'post-list/auction' ? 'active__nav' : ''
          }`}
          aria-current='page'
        >
          Auction
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
