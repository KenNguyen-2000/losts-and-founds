import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import { useAppDispatch } from '../../redux/store';
import './style.scss';
import { authActions } from '../../redux/auth/auth.slice';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { postActions } from '../../redux/post/postSlice';

const Navbar = () => {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(authActions.logout());
  };

  const onSearch = (event: any) => {
    if (event.keyCode === 13) {
      dispatch(postActions.getPostsBySearch(search));
    }
  };

  return (
    <div className='w-full flex items-center justify-between border-b border-gray-200 px-8  py-4 shadow-md '>
      <div
        className='flex gap-2 h-10 items-center cursor-pointer'
        onClick={() => navigate('/post-list')}
      >
        <img alt='logo' src={logo} className='h-full w-auto object-cover' />
        <h2 className='logo__title whitespace-nowrap text-lg font-bold'>
          Lost and Found
        </h2>
      </div>
      <div
        id='searchTerm__outer'
        className='w-full md:w-[360px] flex gap-4 px-4 py-2 items-center border-2 border-gray-300 rounded-lg'
      >
        <FontAwesomeIcon icon={solid('search')} />
        <input
          id='searchTerm'
          name='searchTerm'
          type='text'
          placeholder='Search....'
          className='w-full p-0 border-none focus:ring-0 placeholder:italic font-medium'
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          onKeyDown={onSearch}
        />
      </div>
      <div className='flex gap-2'>
        <div className='rounded-full border border-slate-300 h-8 w-8 relative'>
          <div
            className='w-full h-full bg-slate-400 cursor-pointer rounded-full'
            onClick={() => setIsAvatarOpen(!isAvatarOpen)}
          ></div>
          <ul
            className={`w-32 h-24 bg-white rounded-lg border border-gray-200 drop-shadow-xl absolute top-full right-0 mt-2 flex flex-col justify-evenly py-1 overflow-hidden transition-all duration-200 ease-in-out scale-0 origin-top-right ${
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
    </div>
  );
};

export default Navbar;
