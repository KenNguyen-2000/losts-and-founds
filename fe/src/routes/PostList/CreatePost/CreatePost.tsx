import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { InputFiles } from 'typescript';
import interceptor from '../../../services/interceptor';

const CreatePost = () => {
  const [files, setFiles] = useState<Blob[]>([]);
  const handleCreatePost = async (event: any) => {
    event.preventDefault();
    const { title, location, description } = event.target;

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('location', location.value);
    formData.append('description', description.value);

    files.forEach((file: Blob) => formData.append('files', file));
    console.log(formData);
    try {
      const res = await interceptor.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.status === 200) {
        alert('success');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageFilesChange = async (event: any) => {
    const reader = new FileReader();
    const filesInput = [...event.target.files];

    setFiles(filesInput);
  };

  return (
    <div className='fixed inset-0 backdrop-brightness-90 flex items-center justify-center z-50'>
      <div className='min-w-[500px] max-w-[700px] bg-white rounded-lg flex flex-col'>
        <div className='w-full text-center py-4 relative'>
          <h1 className='text-lg font-semibold'>Create Post</h1>
          <FontAwesomeIcon
            icon={regular('circle-xmark')}
            className='w-6 h-6 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer'
          />
        </div>
        <div className='w-full h-[1px] bg-gray-200'></div>
        <div className='w-full flex flex-col px-4'>
          {/* ********************Avatar header*********************** */}
          <div className='w-full flex gap-3 items-center py-4'>
            <div className='w-10 h-10 rounded-full border border-gray-200 overflow-hidden'>
              <img alt='avatar' className='w-full h-auto object-cover' />
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
                  htmlFor='title'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Title
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
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
              <input
                type='text'
                name='description'
                id='description'
                autoComplete='email'
                className='mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6'
              />
            </div>
            <div className='w-full p-2 border border-gray-200 rounded-lg relative'>
              <input
                type='file'
                name='imageFiles'
                id='imageFiles'
                className='absolute invisible'
                onChange={handleImageFilesChange}
                multiple
              />

              <label
                htmlFor='imageFiles'
                className='w-full h-[200px] bg-slate-100 rounded-lg flex flex-col items-center justify-center cursor-pointer'
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
