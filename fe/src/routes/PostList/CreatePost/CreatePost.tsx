import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import {
  postActions,
  selectPostsError,
  selectPostsLoading,
} from '../../../redux/post/postSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

const CreatePost = ({ closeModal }: any) => {
  const userInfo: any = jwtDecode(Cookies.get('accessToken') as string);

  const [imageSrc, setImageSrc] = useState('');
  const [files, setFiles] = useState<Blob[]>([]);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  const handleCreatePost = async (event: any) => {
    event.preventDefault();
    const { location, description, postType, itemName }: any = event.target;
    let postTypeValue = postType[0];
    for (let type of postType) {
      if (type.checked) {
        postTypeValue = type;
      }
    }

    try {
      dispatch(
        postActions.createPost({
          location: location.value,
          description: description.value,
          postType: postTypeValue.value,
          itemName: itemName.value,
          images: files,
        })
      );

      if (!isLoading && error === undefined) {
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageFilesChange = async (event: any) => {
    const filesInput = [...event.target.files];

    setFiles(filesInput);
  };

  return (
    <div className='fixed inset-0 py-5 backdrop-brightness-90 flex items-center justify-center z-50'>
      <div className='min-w-[500px] md:w-[600px] lg:w-[700px] bg-white rounded-lg flex flex-col'>
        <div className='w-full text-center py-4 relative'>
          <h1 className='text-lg font-semibold'>Create Post</h1>
          <FontAwesomeIcon
            icon={regular('circle-xmark')}
            className='w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'
            onClick={closeModal}
          />
        </div>
        <div className='w-full h-[1px] bg-gray-200'></div>
        <div className='w-full flex flex-col px-4'>
          {/* ********************Avatar header*********************** */}
          <div className='w-full flex gap-3 items-center py-4'>
            <div className='w-10 h-10 rounded-full border border-gray-200 overflow-hidden'>
              <img
                alt='avatar'
                src={userInfo.avatarUrl}
                className='w-full h-auto object-cover'
              />
            </div>
            <div className='h-full flex flex-col justify-between'>
              <h2 className='text-sm font-semibold'>Nguyen Kien</h2>
              <p className='text-xs text-gray-400'>@ngkien</p>
            </div>
          </div>

          {/* *******************form content***************************** */}
          <form
            onSubmit={handleCreatePost}
            encType='multipart/form-data'
            className='w-full flex flex-col gap-4'
          >
            <div className='w-full grid grid-cols-6 gap-4'>
              <div className='col-span-3'>
                <label
                  htmlFor='item-name'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Item name
                </label>
                <input
                  type='text'
                  name='itemName'
                  id='item-name'
                  autoComplete='given-name'
                  className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6'
                />
              </div>
              <div className='col-span-3'>
                <label
                  htmlFor='location'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Location
                </label>
                <input
                  type='text'
                  name='location'
                  id='location'
                  autoComplete='given-name'
                  className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='col-span-6 sm:col-span-4'>
              <label
                htmlFor='description'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                rows={3}
                className='mt-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:py-1.5 sm:text-sm sm:leading-6'
                placeholder='Describe the stuff'
              ></textarea>

              {/* <input
                type='text'
                name='description'
                id='description'
                autoComplete='email'
                className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6'
              /> */}
            </div>
            <fieldset>
              <legend className='block text-sm font-medium leading-6 text-gray-900'>
                Type of Post:
              </legend>
              <div className='mt-2 flex gap-10'>
                <div className='flex items-center '>
                  <input
                    id='category-lost'
                    name='postType'
                    type='radio'
                    value='lost'
                    defaultChecked
                    className='h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer'
                  />
                  <label
                    htmlFor='category-lost'
                    className='ml-3 block text-sm font-medium leading-6 text-gray-900 cursor-pointer'
                  >
                    Lost
                  </label>
                </div>
                <div className='flex items-center '>
                  <input
                    id='category-found'
                    name='postType'
                    type='radio'
                    value='found'
                    className='h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer'
                  />
                  <label
                    htmlFor='category-found'
                    className='ml-3 block text-sm font-medium leading-6 text-gray-900 cursor-pointer'
                  >
                    Found
                  </label>
                </div>
                <div className='flex items-center '>
                  <input
                    id='category-auction'
                    name='postType'
                    type='radio'
                    value='auction'
                    className='h-4 w-4 border-gray-300 text-amber-500 focus:ring-amber-500 cursor-pointer'
                  />
                  <label
                    htmlFor='category-auction'
                    className='ml-3 block text-sm font-medium leading-6 text-gray-900 cursor-pointer'
                  >
                    Auction
                  </label>
                </div>
              </div>
            </fieldset>
            <div className='w-full p-2 border border-gray-200 rounded-lg relative'>
              <input
                type='file'
                name='imageFiles'
                id='imageFiles'
                className='absolute invisible'
                accept='image/png, image/jpeg'
                onChange={handleImageFilesChange}
                multiple
              />

              <label
                htmlFor='imageFiles'
                className='w-full min-h-[200px] max-h-[350px] bg-slate-100 rounded-lg flex flex-col items-center justify-center cursor-pointer relative'
              >
                <div className='w-14 h-14 rounded-full bg-slate-300 flex items-center justify-center'>
                  <FontAwesomeIcon icon={solid('download')} size={'2xl'} />
                </div>
                <p className='font-medium'>Add Images</p>
              </label>
            </div>
            <button
              type='submit'
              className='w-full py-2 bg-slate-200 rounded-lg mb-3 font-semibold hover:bg-amber-500 hover:text-white '
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
