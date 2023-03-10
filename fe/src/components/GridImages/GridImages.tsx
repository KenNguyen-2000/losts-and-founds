import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';

interface IGridImages {
  images?: string[];
}

const GridImages = ({ images }: IGridImages) => {
  return (
    <>
      <div className='w-full h-full grid grid-rows-2 grid-cols-1 gap-1'>
        <div className='w-full max-h-[55%] grid grid-cols-2 gap-1'>
          <div className='w-full h-full flex items-center justify-center border border-gray-200 cursor-pointer'>
            <img alt='logo' src={logo} className='h-full w-auto object-cover' />
          </div>
          <div className='w-full h-full flex items-center justify-center border border-gray-200 cursor-pointer'>
            <img alt='logo' src={logo} className='h-full w-auto object-cover' />
          </div>
        </div>
        <div className='w-full max-h-[45%] grid grid-cols-3 gap-1'>
          <div className='w-full h-full flex items-center justify-center border border-gray-200 cursor-pointer'>
            <img alt='logo' src={logo} className='h-full w-auto object-cover' />
          </div>
          <div className='w-full h-full flex items-center justify-center border border-gray-200 cursor-pointer'>
            <img alt='logo' src={logo} className='h-full w-auto object-cover' />
          </div>
          <div className='w-full h-full flex items-center justify-center border border-gray-200 cursor-pointer'>
            <img alt='logo' src={logo} className='h-full w-auto object-cover' />
          </div>
        </div>
      </div>
    </>
  );
};

export default GridImages;
