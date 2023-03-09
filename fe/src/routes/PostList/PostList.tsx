import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components';
import { IPost } from '../../interfaces/post';
import { selectAuthLoading } from '../../redux/auth/auth.slice';
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

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    dispatch(postActions.getPostList());
    console.log(posts);
  }, []);

  return (
    <div className='flex flex-col min-hscreen'>
      <Navbar />
      <div className='flex-grow min-h-screen flex items-start justify-evenly bg-gray-100'>
        {isShow && <CreatePost closeModal={() => setIsShow(false)} />}
        <div className='w-[300px]'></div>
        <div className='flex-grow max-w-[700px] flex flex-col items-center py-4 gap-4'>
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
        <div className='w-[300px]'></div>
      </div>
    </div>
  );
};

export default PostList;
