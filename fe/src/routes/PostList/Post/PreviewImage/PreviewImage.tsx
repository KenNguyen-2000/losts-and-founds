import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import './PreviewImage.style.scss';

interface IPreviewImage {
  imgNum: number;
  setClosePreview: any;
  images: string[];
}

const PreviewImage = ({ imgNum, setClosePreview, images }: IPreviewImage) => {
  const [currentImgNum, setCurrentImgNum] = useState(imgNum);

  const handlePreviousImg = (event: any) => {
    event?.stopPropagation();
    if (currentImgNum === 0) {
      setCurrentImgNum(images.length - 1);
    } else {
      setCurrentImgNum((prev) => prev - 1);
    }
  };

  const handleNextImg = (event: any) => {
    event?.stopPropagation();
    if (currentImgNum === images.length - 1) {
      setCurrentImgNum(0);
    } else {
      setCurrentImgNum((prev) => prev + 1);
    }
  };

  return (
    <div
      className='previewImage__wrapper fixed inset-0 z-20 flex items-center justify-center backdrop-brightness-50 backdrop-blur-sm'
      onClick={setClosePreview}
    >
      <FontAwesomeIcon
        icon={solid('circle-xmark')}
        className='w-10 h-10 absolute top-2 right-8 z-50 cursor-pointer'
        onClick={setClosePreview}
      />
      {images.length > 1 ? (
        <div
          className='previewImage-panel-control absolute left-0 previous h-full max-h-screen flex items-center pl-4 pr-2 cursor-pointer'
          onClick={handlePreviousImg}
        >
          <FontAwesomeIcon
            icon={solid('circle-chevron-left')}
            className='w-10 h-10 transition duration-300'
          />
        </div>
      ) : null}

      <div
        className='h-full max-w-[80%] max-h-screen'
        onClick={(event) => event.stopPropagation()}
      >
        <img
          className='h-full max-w-full object-contain'
          alt='preview'
          crossOrigin='anonymous'
          src={`${process.env.REACT_APP_IMG_URL}/${images[currentImgNum]}`}
        />
      </div>
      {images.length > 1 ? (
        <div
          className='previewImage-panel-control absolute right-0 next h-full max-h-screen flex items-center pr-4 pl-2 cursor-pointer'
          onClick={handleNextImg}
        >
          <FontAwesomeIcon
            icon={solid('circle-chevron-right')}
            className='w-10 h-10 transition duration-300'
          />
        </div>
      ) : null}
    </div>
  );
};

export default PreviewImage;
