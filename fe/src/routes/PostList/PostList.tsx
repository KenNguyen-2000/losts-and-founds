import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components';
import { IPost } from '../../interfaces/post';
import {
  postActions,
  selectPosts,
  selectPostsLoading,
} from '../../redux/post/postSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import CreatePost from './CreatePost/CreatePost';
import Post from './Post/Post';

const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const isLoading = useAppSelector(selectPostsLoading);
  const [filter, setFilter] = useState('');

  const [isShow, setIsShow] = useState(false);

  const handleFilterChange = (event: any) => {
    if (event.target.checked) {
      setFilter((prev) => prev);
    }
  };

  useEffect(() => {
    dispatch(postActions.getPostList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('Render from Post List');

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-grow flex flex-col md:flex-row gap-8 items-start justify-between bg-gray-100 px-8 sm:px-5'>
        {isShow && <CreatePost closeModal={() => setIsShow(false)} />}
        <div className='w-full lg:w-[350px] py-4'>
          <fieldset className='w-full bg-white rounded-md shadow-md p-3'>
            <legend className='sr-only'>Filter</legend>
            <div
              className='text-sm font-semibold leading-6 text-gray-900'
              aria-hidden='true'
            >
              Filter
            </div>
            <div className='mt-4 space-y-4'>
              <div className='flex items-start'>
                <div className='flex h-6 items-center'>
                  <input
                    id='comments'
                    name='comments'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500'
                    onChange={handleFilterChange}
                  />
                </div>
                <div className='ml-3 text-sm leading-6'>
                  <label
                    htmlFor='comments'
                    className='font-medium text-gray-900'
                  >
                    Top Likes
                  </label>
                  <p className='text-gray-500 md:sr-only lg:not-sr-only'>
                    The posts have most likes get priority
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='flex h-6 items-center'>
                  <input
                    id='candidates'
                    name='candidates'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500'
                    onChange={handleFilterChange}
                  />
                </div>
                <div className='ml-3 text-sm leading-6'>
                  <label
                    htmlFor='candidates'
                    className='font-medium text-gray-900'
                  >
                    Latest
                  </label>
                  <p className='text-gray-500 md:sr-only lg:not-sr-only'>
                    The recents post is priority
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <div className='flex h-6 items-center'>
                  <input
                    id='offers'
                    name='offers'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500'
                    onChange={handleFilterChange}
                  />
                </div>
                <div className='ml-3 text-sm leading-6'>
                  <label htmlFor='offers' className='font-medium text-gray-900'>
                    Most discuss
                  </label>
                  <p className='text-gray-500 md:sr-only lg:not-sr-only'>
                    Posts with the most discussions
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className='flex-grow flex flex-col w-full md:w-auto items-center py-4 gap-4'>
          <div
            className='w-full  rounded-lg bg-white px-4 py-2 flex  items-center gap-4'
            onClick={() => setIsShow(true)}
          >
            <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-100'>
              <img alt='avatar' src='' />
            </div>
            <span className='w-full py-2 px-3 bg-slate-200 text-sm rounded-full self-center hover:bg-slate-300 cursor-pointer'>
              Write something about your stuff
            </span>
          </div>
          {isLoading
            ? 'Fetching posts'
            : posts?.map((post: IPost) => <Post key={post._id} {...post} />)}
        </div>
        <div className='w-full lg:w-[350px]'></div>
      </div>
    </div>
  );
};

export default PostList;
