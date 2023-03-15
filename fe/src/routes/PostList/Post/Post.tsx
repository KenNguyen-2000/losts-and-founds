import React, { useState } from 'react';
import logo from '../../../assets/images/logo.png';
import './Post.style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import CommentList from '../CommentList/CommentList';
import { IPost } from '../../../interfaces/post';
import { useAppDispatch } from '../../../redux/store';
import { postActions } from '../../../redux/post/postSlice';
import { GridImages } from '../../../components';
import jwt from 'jwt-decode';
import { selectUserInfo } from '../../../redux/user/userSlice';
import jwtDecode from 'jwt-decode';
import ReactTimeAgo from 'react-time-ago';
import Cookies from 'js-cookie';
import interceptor from '../../../services/interceptor';

interface IPostComponent extends IPost {
  setSelectedPost: any;
  ref?: any;
}

const Post = ({
  _id,
  description,
  location,
  postType,
  comments,
  createdAt,
  createdBy,
  images,
  likes,
  status,
  updatedAt,
  setSelectedPost,
  ref,
  itemName,
}: IPostComponent) => {
  const dispatch = useAppDispatch();

  const userInfo: any = jwtDecode(Cookies.get('accessToken') as string);

  const handleLikeBtn = () => {
    let type = 'like';
    if (likes?.length > 0) {
      const isLiked = likes.find((like) => like._id === createdBy._id);
      if (isLiked) {
        type = 'dislike';
      }
    }

    dispatch(postActions.likePost({ _id, type }));
  };
  const handleCommentBtn = () => {};

  const handleDeletePost = () => {
    dispatch(postActions.deletePost(_id));
  };

  return (
    <>
      <section
        ref={ref}
        className='post__wrapper w-full bg-white flex flex-col rounded-lg border border-gray-200 '
      >
        <header className='post__header w-full px-4 py-2 flex justify-between items-center'>
          <div className='flex gap-2'>
            <img
              className='w-10 h-10 rounded-full overflow-hidden object-cover'
              src={createdBy.avatarUrl}
              alt='avatar'
            />
            <div className='flex flex-col justify-between'>
              <div className='text-base font-medium'>
                {createdBy.name}{' '}
                <span className='text-sm'>
                  {postType} {itemName} at {location}
                </span>
              </div>
              <div className='text-xs text-gray-400'>
                <ReactTimeAgo
                  date={new Date(createdAt!)}
                  locale='en-US'
                  timeStyle='twitter'
                  className='text-inherit'
                />{' '}
                ago
              </div>
            </div>
          </div>

          {userInfo._id === createdBy._id ? (
            <div className='flex gap-2'>
              <div
                className='w-7 h-7 p-1.5 flex items-center justify-center rounded-full hover:bg-slate-300 post__icon'
                onClick={setSelectedPost}
              >
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
                  onClick={handleDeletePost}
                />
              </div>
            </div>
          ) : null}
        </header>
        <div className='px-4 text-sm font-medium text-gray-700 pb-2'>
          Contact: <span>{userInfo.email}</span>
        </div>
        <section className='post__body w-full flex flex-col gap-2'>
          <div className='post__description w-full px-4'>{description}</div>
          <div className='max-w-full min-w-[500px] px-4 border-t border-b border-gray-200 flex items-center justify-center cursor-pointer'>
            {/* <img
              className='post__img w-full h-full object-contain'
              alt='post img'
              crossOrigin='anonymous'
              src={`${process.env.REACT_APP_IMG_URL}/${images[0]}`}
            /> */}
            <GridImages images={images} />
          </div>
        </section>
        <section className='post__bottom flex flex-col px-4'>
          <div className='w-full flex justify-between py-[10px]'>
            <div className='text-sm text-gray-500 flex gap-2 items-center'>
              <FontAwesomeIcon
                icon={regular('thumbs-up')}
                className='bg-amber-400 rounded-full p-1.5'
              />

              <span className='text-gray-500'>
                {likes.length > 0
                  ? likes.length > 1
                    ? `${likes[0].name} and ${likes.length - 1} other people`
                    : `${likes[0].name}`
                  : null}
              </span>
            </div>
            <div className='text-sm text-gray-500'>
              {comments.length} comments
            </div>
          </div>
          <div className='flex items-center justify-evenly  border-y border-gray-300'>
            <div
              className='w-full h-11 flex gap-3 items-center justify-center text-sm font-medium cursor-pointer hover:bg-slate-200 text-gray-500'
              role='button'
              onClick={handleLikeBtn}
            >
              <FontAwesomeIcon
                icon={regular('thumbs-up')}
                className={`w-5 h-5  post__icon ${
                  likes.find((like) => like._id === userInfo._id)
                    ? 'active'
                    : ''
                }`}
                fixedWidth
              />
              <span
                className={`${
                  likes.find((like) => like._id === createdBy._id)
                    ? 'text-amber-500'
                    : ''
                }`}
              >
                Like
              </span>
            </div>
            <a
              className='w-full h-11 flex gap-3 items-center justify-center text-sm font-medium cursor-pointer hover:bg-slate-200 text-gray-500'
              href={`#comment_${_id}`}
              onClick={handleCommentBtn}
            >
              <FontAwesomeIcon
                icon={solid('comments')}
                className='w-5 h-5  post__icon '
                fixedWidth
              />
              <span>Comment</span>
            </a>
          </div>
          <CommentList postId={_id} comments={comments} />
        </section>
      </section>
    </>
  );
};

export default Post;
