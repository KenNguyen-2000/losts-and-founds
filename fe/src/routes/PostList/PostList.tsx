import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar } from '../../components';
import { IPost } from '../../interfaces/post';
import {
  postActions,
  selectLoading,
  selectPagingPosts,
  selectPosts,
  selectPostsHasMore,
  selectPostsLoading,
} from '../../redux/post/postSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import CreatePost from './CreatePost/CreatePost';
import EditPostModal from './EditPostModal/EditPostModal';
import Post from './Post/Post';

const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const isLoading = useAppSelector(selectPostsLoading);
  const loading = useAppSelector(selectLoading);
  const { hasMore, pageNo, pageSize } = useAppSelector(selectPagingPosts);

  const [page, setPage] = useState(0);

  const [selectedPost, setSelectedPost] = useState<IPost | undefined>(
    undefined
  );
  const [filter, setFilter] = useState('');
  const [isShow, setIsShow] = useState(false);

  const elementRef = useRef(null);

  const getAction = () =>
    dispatch(postActions.getPostList({ pageNo: page, pageSize }));

  const handleFilterChange = (event: any) => {
    if (event.target.checked) {
      setFilter((prev) => prev);
    }
  };

  const handleGetLostsPostList = async () => {
    await dispatch(postActions.getPostList({ pageNo: page, pageSize }));
  };

  const handleGetFoundsPostList = async () => {
    await getAction();
  };

  const onIntersection = (entries: any) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      getAction();
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pageNo]);

  console.log('Render from Post List');

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-grow flex flex-col md:flex-row gap-8 items-start justify-between bg-gray-100 px-8 sm:px-5'>
        {isShow && <CreatePost closeModal={() => setIsShow(false)} />}
        {selectedPost ? (
          <EditPostModal
            post={selectedPost}
            closeModal={() => setSelectedPost(undefined)}
          />
        ) : null}
        <div className='w-full lg:w-[400px] py-4'>
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
                    className='font-medium text-gray-900 cursor-pointer'
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
                    className='font-medium text-gray-900 cursor-pointer'
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
                  <label
                    htmlFor='offers'
                    className='font-medium text-gray-900 cursor-pointer'
                  >
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
        <div className='flex-grow flex flex-col items-center w-full md:max-w-[700px] lg:max-w-[800px] py-4 gap-2'>
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

          <div className='w-full flex gap-1'>
            <button
              className='w-full text-center py-2 bg-white rounded-md border border-gray-300'
              onClick={handleGetLostsPostList}
            >
              Lost
            </button>
            <button
              className='w-full text-center py-2 bg-white rounded-md border border-gray-300'
              onClick={handleGetFoundsPostList}
            >
              Found
            </button>
          </div>

          {!loading &&
            posts?.map((post: IPost, index: number) => (
              <Post
                key={post._id}
                setSelectedPost={() => setSelectedPost(post)}
                {...post}
              />
            ))}
          {hasMore && (
            <div
              ref={elementRef}
              className='invisible h-0 w-0 overflow-hidden'
            ></div>
          )}
          {isLoading && (
            <div className='w-full min-h-[200px] border border-gray-200 shadow rounded-md p-4'>
              <div className='animate-pulse flex flex-col space-y-4'>
                <div className='flex gap-2 items-center'>
                  <div className='rounded-full bg-slate-300 h-10 w-10'></div>
                  <div className='h-9 flex flex-col justify-between'>
                    <div className='h-2 w-28 bg-slate-300 rounded'></div>
                    <div className='h-2 w-12 bg-slate-300 rounded'></div>
                  </div>
                </div>

                <div className='flex-1 space-y-6 py-1'>
                  <div className='h-2 bg-slate-300 rounded'></div>
                  <div className='space-y-3'>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='h-2 bg-slate-300 rounded col-span-2'></div>
                      <div className='h-2 bg-slate-300 rounded col-span-1'></div>
                    </div>
                    <div className='h-2 bg-slate-300 rounded'></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='w-full lg:w-[400px]'></div>
      </div>
    </div>
  );
};

export default PostList;
