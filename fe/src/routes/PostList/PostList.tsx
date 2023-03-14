import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components';
import { IPost } from '../../interfaces/post';
import {
  postActions,
  selectLoading,
  selectPosts,
  selectPostsHasMore,
  selectPostsLoading,
  selectPostsPageNo,
} from '../../redux/post/postSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import postService from '../../services/post.service';
import CreatePost from './CreatePost/CreatePost';
import EditPostModal from './EditPostModal/EditPostModal';
import Post from './Post/Post';

interface IPostList {
  typePost?: string;
}

const PostList = ({ typePost }: IPostList) => {
  const dispatch = useAppDispatch();
  const userInfo: any = jwtDecode(Cookies.get('accessToken') as string);

  const [search, setSearch] = useState('');
  const posts = useAppSelector(selectPosts);
  const isPostsLoading = useAppSelector(selectPostsLoading);
  const loading = useAppSelector(selectLoading);
  const hasMore = useAppSelector(selectPostsHasMore);
  const pageNo = useAppSelector(selectPostsPageNo);

  const [selectedPost, setSelectedPost] = useState<IPost | undefined>(
    undefined
  );
  const [query, setQuery] = useState({
    search: '',
    pageNo: pageNo,
    pageSize: 3,
    sortBy: ['createdAt'],
    postType: typePost ? typePost : undefined,
  });
  const [isShow, setIsShow] = useState(false);
  const elementRef = useRef(null);

  const onSearch = (event: any) => {
    if (event.keyCode === 13) {
      dispatch(postActions.getPostsBySearch(search));
    }
  };

  const handleFilterChange = (event: any) => {
    if (event.target.checked) {
      dispatch(
        postActions.getPostList({
          ...query,
          pageNo: 0,
          sortBy: ['createdAt', event.target.value],
        })
      );
      setQuery((prev) => ({
        ...prev,
        sortBy: ['createdAt', event.target.value],
      }));
    }
  };

  const onIntersection = (entries: any, observer: any) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      console.log('Visible');
      if (firstEntry.intersectionRatio >= 0.75) {
        if (pageNo === 0) {
          dispatch(postActions.getPostList(query));
          setQuery((prev) => ({
            ...prev,
            pageNo: prev.pageNo + 1,
          }));
        } else {
          dispatch(postActions.getMorePosts(query));
          setQuery((prev) => ({
            ...prev,
            pageNo: prev.pageNo + 1,
          }));
        }
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (posts.length > 0) {
        dispatch(postActions.reloadPosts);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [pageNo]);

  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex items-center drop-shadow-md border-b bg-white border-gray-200 py-4 pl-8 gap-4'>
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
      <div className='w-full flex flex-col md:flex-row gap-8 items-start justify-between px-8 sm:px-5'>
        {isShow && <CreatePost closeModal={() => setIsShow(false)} />}
        {selectedPost ? (
          <EditPostModal
            post={selectedPost}
            closeModal={() => setSelectedPost(undefined)}
          />
        ) : null}

        <div className='flex-grow flex flex-col items-center w-full py-4 gap-2'>
          <div
            className='w-full  rounded-lg bg-white px-4 py-2 flex  items-center gap-4 border border-gray-200'
            onClick={() => setIsShow(true)}
          >
            <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-100'>
              <img
                alt='avatar'
                src={userInfo.avatarUrl}
                className='w-full h-full object-cover'
              />
            </div>
            <span className='w-full py-2 px-3 bg-slate-200 text-sm rounded-full self-center hover:bg-slate-300 cursor-pointer'>
              Write something about your stuff
            </span>
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
          {isPostsLoading && (
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
                  <div className='space-y-3'>
                    <div className='h-2 bg-slate-300 rounded'></div>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='h-2 bg-slate-300 rounded col-span-2'></div>
                      <div className='h-2 bg-slate-300 rounded col-span-1'></div>
                    </div>
                    <div className='h-2 bg-slate-300 rounded'></div>
                  </div>
                  <div className='mt-4 h-[200px] bg-slate-300'></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='w-full lg:w-[600px] py-4'>
          <fieldset className='bg-white px-4 py-2 shadow-md rounded-md'>
            <legend className='contents text-sm font-semibold leading-6 text-gray-900'>
              Push Notifications
            </legend>
            <p className='text-sm text-gray-500'>
              These are delivered via SMS to your mobile phone.
            </p>
            <div className='mt-4 space-y-4'>
              <div className='flex items-center'>
                <input
                  id='likes'
                  value='likes'
                  name='filter'
                  type='radio'
                  className='h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500'
                  onChange={handleFilterChange}
                />
                <label
                  htmlFor='likes'
                  className='ml-3 block text-sm font-medium leading-6 text-gray-900'
                >
                  Top likes
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='comments'
                  value='comments'
                  name='filter'
                  type='radio'
                  className='h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500'
                  onChange={handleFilterChange}
                />
                <label
                  htmlFor='comments'
                  className='ml-3 block text-sm font-medium leading-6 text-gray-900'
                >
                  Top comments
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default PostList;
