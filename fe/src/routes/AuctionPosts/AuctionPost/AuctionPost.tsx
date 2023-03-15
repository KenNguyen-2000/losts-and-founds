import React, { useState } from 'react';
import './AuctionPost.style.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { IPost } from '../../../interfaces/post';
import { useAppDispatch } from '../../../redux/store';
import { postActions } from '../../../redux/post/postSlice';
import { GridImages } from '../../../components';
import jwtDecode from 'jwt-decode';
import ReactTimeAgo from 'react-time-ago';
import Cookies from 'js-cookie';
import interceptor from '../../../services/interceptor';
import PreviewImage from '../../PostList/Post/PreviewImage/PreviewImage';

interface IPostComponent extends IPost {
  setSelectedPost: any;
  ref?: any;
}

const AuctionPost = ({
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
  itemName,
  minPrice,
  auctionExpired,
  raisedUser,
  priceStep,
}: IPostComponent) => {
  const dispatch = useAppDispatch();

  const userInfo: any = jwtDecode(Cookies.get('accessToken') as string);
  const [showPreview, setShowPreview] = useState(false);
  const today = new Date();

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

  const handleDeletePost = () => {
    dispatch(postActions.deletePost(_id));
  };

  const handleRaisePrice = () => {
    dispatch(
      postActions.raisePrice({
        minPrice: minPrice,
        priceStep: priceStep,
        postId: _id,
      })
    );
  };

  const handleCheckout = async (event: any) => {
    event.preventDefault();
    try {
      const res = await interceptor.post(
        process.env.REACT_APP_SERVER_URL +
          `/posts/${_id}/create-checkout-session`,
        {
          itemName: itemName,
          amount: minPrice,
        }
      );

      if (res.status === 200) {
        window.location.assign(res.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showPreview && (
        <PreviewImage
          imgNum={0}
          images={images}
          setClosePreview={() => setShowPreview(false)}
        />
      )}
      <section className='post__wrapper w-full bg-white flex flex-col rounded-lg border overflow-hidden border-gray-200 shadow-md relative'>
        {userInfo._id === createdBy._id ? (
          <div className='absolute top-2 right-2 z-10 flex gap-1'>
            <div
              className='w-4 h-4  flex items-center justify-center rounded-full hover:bg-slate-300 post__icon'
              onClick={setSelectedPost}
            >
              <FontAwesomeIcon
                icon={solid('pen')}
                className=' cursor-pointer w-auto h-full '
                fill='#000'
              />
            </div>

            <div className='w-4 h-4  flex items-center justify-center rounded-full hover:bg-slate-300 post__icon'>
              <FontAwesomeIcon
                icon={solid('xmark')}
                className='w-auto h-full cursor-pointer '
                fixedWidth
                onClick={handleDeletePost}
              />
            </div>
          </div>
        ) : null}
        <div
          className='h-[200px] w-full flex items-center  border-b border-gray-200 relative cursor-pointer'
          onClick={() => setShowPreview(true)}
        >
          <img
            alt='auctio post'
            crossOrigin='anonymous'
            src={process.env.REACT_APP_IMG_URL + '/' + images[0]}
            className='h-full w-full object-contain'
            onClick={() => setShowPreview(true)}
          />
          {images.length > 1 && (
            <div className='auction-post__ absolute inset-0 backdrop-brightness-75 z-10 flex items-center justify-center gap-1 text-2xl font-semibold cur'>
              <FontAwesomeIcon icon={solid('plus')} className='w-6 h-6' />
              <span>{images.length - 1}</span>
            </div>
          )}
        </div>
        <div className=' flex flex-col justify-between  px-4 py-2 bg-white'>
          <div className='flex flex-col'>
            <div className='text-base'>
              <span className='text-lg'>{itemName}</span>
            </div>
            <p className='text-gray-500 text-sm h-20 text-ellipsis'>
              {description}
            </p>
          </div>
          <div className='flex justify-between'>
            <span className='text-lg'>{minPrice}$</span>
            {}

            {today.getTime() > new Date(auctionExpired).getTime() ? (
              <button
                className={`bg-amber-500 text-white px-3 py-1 rounded-md font-medium text-sm ${
                  raisedUser !== userInfo._id || userInfo._id === createdBy._id
                    ? 'pointer-events-none bg-gray-400'
                    : 'pointer-events-auto'
                }`}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            ) : (
              <button
                className={`bg-amber-500 text-white px-3 py-1 rounded-md font-medium text-sm ${
                  createdBy._id === userInfo._id
                    ? 'pointer-events-none bg-gray-400'
                    : 'pointer-events-auto'
                }`}
                onClick={handleRaisePrice}
              >
                {raisedUser === userInfo._id ? 'Raised' : 'Raise'}
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AuctionPost;
