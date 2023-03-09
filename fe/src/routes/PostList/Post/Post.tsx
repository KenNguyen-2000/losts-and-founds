import React from 'react';
import logo from '../../../assets/images/logo.png';
import './Post.style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import CommentList from '../CommentList/CommentList';

const Post = () => {
  const handleLikeBtn = () => {};
  const handleCommentBtn = () => {};

  return (
    <>
      <section className='post__wrapper w-full bg-white flex flex-col rounded-lg border border-gray-300 '>
        <header className='post__header w-full px-4 py-2 flex justify-between items-center'>
          <div className='flex gap-2'>
            <img
              className='w-10 h-10 rounded-full overflow-hidden object-cover'
              src={logo}
              alt='avatar'
            />
            <div className='flex flex-col justify-between'>
              <div className='text-sm font-medium'>Nguyen Thanh Kien</div>
              <div className='text-xs text-gray-400'>1 hour ago</div>
            </div>
          </div>
          <div className='flex gap-2'>
            {/* <img
            alt='3 dots horizontal'
            src={dots}
            className='post__icon w-auto h-6 '
          />
          <img
            alt='Close Icon'
            src={closeIcon}
            className='post__icon w-auto h-6'
          /> */}
            <div className='w-7 h-7 p-1.5 flex items-center justify-center rounded-full hover:bg-slate-300 post__icon'>
              <FontAwesomeIcon
                icon={solid('ellipsis')}
                className=' cursor-pointer w-auto h-full '
                fill='#000'
              />
            </div>
            <div className='w-7 h-7 p-1.5 flex items-center justify-center rounded-full hover:bg-slate-300 post__icon'>
              <FontAwesomeIcon
                icon={solid('xmark')}
                className='w-auto h-full cursor-pointer '
                fixedWidth
              />
            </div>
          </div>
        </header>
        <section className='post__body w-full flex flex-col gap-2'>
          <div className='post__description w-full px-4'>
            Khi người học giỏi tán gái 😃 Anh chị MC chắc cũng đau đầu lắm.
          </div>
          <div className='max-w-full min-w-[500px] px-4 border-t border-b border-gray-200'>
            <img
              className='post__img w-full h-full object-contain'
              alt='post img'
              src={logo}
            />
          </div>
        </section>
        <section className='post__bottom flex flex-col px-4'>
          <div className='w-full flex justify-end py-[10px]'>
            <div className='text-sm text-gray-500 '>412 comments</div>
          </div>
          <div className='flex items-center justify-evenly  border-y border-gray-300'>
            <div
              className='w-full h-11 flex gap-3 items-center justify-center text-sm font-medium cursor-pointer hover:bg-slate-200 text-gray-500'
              role='button'
              onClick={handleLikeBtn}
            >
              <FontAwesomeIcon
                icon={regular('thumbs-up')}
                className='w-5 h-5  post__icon'
                fixedWidth
              />
              <span>Like</span>
            </div>
            <div
              className='w-full h-11 flex gap-3 items-center justify-center text-sm font-medium cursor-pointer hover:bg-slate-200 text-gray-500'
              role='button'
              onClick={handleCommentBtn}
            >
              <FontAwesomeIcon
                icon={solid('comments')}
                className='w-5 h-5  post__icon'
                fixedWidth
              />
              <span>Comment</span>
            </div>
          </div>
          <CommentList />
        </section>
      </section>
    </>
  );
};

export default Post;
