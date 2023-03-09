import React, { useRef, useState } from 'react';
import logo from '../../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import './CommentList.style.scss';

const CommentList = () => {
  const [manageMenuOpen, setManageMenuOpen] = useState(false);

  const openManageDropdown = () => {};

  return (
    <section className='commentList__wrapper w-full flex flex-col gap-1 mt-1 mb-2'>
      <div className='min-h-[32px] text-sm font-semibold flex items-center'>
        <span>More comments</span>
      </div>
      <ul className='flex flex-col gap-1'>
        <li className='w-full flex items-start  gap-2'>
          <div className='w-8 h-8 bg-white border border-gray-200 rounded-full overflow-hidden shadow-xs'>
            <img
              className='w-full h-auto object-cover'
              src={logo}
              alt='avatar'
            />
          </div>
          <div className='flex-grow flex gap-2 '>
            <div className='commentList-comment-item__wrapper min-h-[40px] w-fit px-3 py-2 flex flex-col gap-1 rounded-md bg-slate-200'>
              <span className='text-xs font-semibold'>Nguyen Kien</span>
              <p className='text-sm'>Hello</p>
            </div>
            <div className='flex items-center relative'>
              <div
                className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 cursor-pointer'
                onClick={() => setManageMenuOpen(!manageMenuOpen)}
              >
                <FontAwesomeIcon
                  icon={solid('ellipsis')}
                  className='commentList-comment-item__icon w-4 h-4 '
                  fixedWidth
                />
              </div>
              {manageMenuOpen && (
                <ul className='commentList-comment-item__dropdown-menu  p-2 flex flex-col rounded-md'>
                  <li className='py-3 px-2 cursor-pointer hover:bg-slate-200 rounded-md'>
                    Edit
                  </li>
                  <li className='py-3 px-2 cursor-pointer hover:bg-slate-200 rounded-md'>
                    Delete
                  </li>
                </ul>
              )}
            </div>
          </div>
        </li>
      </ul>
      <div className='w-full flex gap-1 items-center mt-1'>
        <label
          htmlFor='comment'
          className='w-8 h-8 bg-white border border-gray-200 rounded-full overflow-hidden shadow-xs'
        >
          <img className='w-full h-auto object-cover' src={logo} alt='avatar' />
        </label>
        <input
          type='text'
          id='comment'
          name='comment'
          placeholder='Comment something...'
          className='flex-grow rounded-full border-none px-3 py-2 bg-slate-200 text-sm  focus:ring-0'
        />
      </div>
    </section>
  );
};

export default CommentList;