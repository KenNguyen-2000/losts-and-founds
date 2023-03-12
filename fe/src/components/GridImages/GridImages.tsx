import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import PreviewImage from '../../routes/PostList/Post/PreviewImage/PreviewImage';
import './GridImages.style.scss';

interface IGridImages {
  images: string[];
}

const GridImages = ({ images }: IGridImages) => {
  const [imgSrc, setImgSrc] = useState(-1);
  const showImgs = images.slice(0, 4);
  let cols = 3;
  if (images.length === 2 || images.length === 3) {
    cols = 2;
  }
  return (
    <>
      {imgSrc >= 0 ? (
        <PreviewImage
          imgNum={imgSrc}
          images={images}
          setClosePreview={() => setImgSrc(-1)}
        />
      ) : null}
      <div
        className={`gridImages__wrapper max-w-full max-h-full grid grid-cols-${cols} gap-1`}
      >
        {showImgs.map((image: string, index) => {
          if (index === 3 && images.length > 4) {
            return (
              <div
                key={image}
                className='w-full h-full relative rounded-sm overflow-hidden'
                onClick={() => setImgSrc(index)}
              >
                <img
                  key={image}
                  alt='logo'
                  crossOrigin='anonymous'
                  src={`${process.env.REACT_APP_IMG_URL}/${image}`}
                  className='h-full w-full object-cover '
                />
                <div className='gridImages__extra absolute inset-0 backdrop-brightness-75 flex items-center justify-center'>
                  <FontAwesomeIcon icon={solid('plus')} className='w-6 h-6' />
                  <span className='text-3xl text-white font-semibold'>
                    {images.length - 4}
                  </span>
                </div>
              </div>
            );
          }
          return (
            <div
              key={image}
              onClick={() => setImgSrc(index)}
              className={`rounded-sm overflow-hidden ${
                (images.length === 1 || images.length >= 3) && index === 0
                  ? `colspan-${cols}`
                  : ''
              }`}
            >
              <img
                alt='logo'
                crossOrigin='anonymous'
                src={`${process.env.REACT_APP_IMG_URL}/${image}`}
                className={`h-full w-full object-cover rounded-sm `}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GridImages;
