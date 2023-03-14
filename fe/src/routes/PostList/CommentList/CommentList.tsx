import React, { useState, useCallback } from 'react';
import logo from '../../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import './CommentList.style.scss';
import { useAppDispatch } from '../../../redux/store';
import { postActions } from '../../../redux/post/postSlice';
import { IComment } from '../../../interfaces/comment';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

interface ICommentList {
  postId: string;
  comments: IComment[];
}

const CommentList = ({ postId, comments }: ICommentList) => {
  const userInfo: any = jwtDecode(Cookies.get('accessToken') as string);

  const dispatch = useAppDispatch();
  const [shownComments, setShownComments] = useState<IComment[]>(
    comments.slice(0, 3)
  );

  const [manageMenuOpen, setManageMenuOpen] = useState('');

  const handleComment = (event: any) => {
    if (event.keyCode === 13) {
      dispatch(
        postActions.commentPost({ postId, description: event.target.value })
      );
      event.target.value = '';
    }
  };

  const handleOpenManageMenu = (commentId: string) => {
    if (commentId === manageMenuOpen) {
      setManageMenuOpen('');
    } else {
      setManageMenuOpen(commentId);
    }
  };

  const showMoreComment = () => {
    if (!(showMoreComment.length >= comments.length)) {
      const appendComments = comments.slice(
        shownComments.length,
        shownComments.length + 3
      );
      setShownComments((prev) => prev.concat(appendComments));
    }
  };

  const handleDeleteComment = (commentId: string) => {
    dispatch(postActions.deleteCommentPost({ commentId, postId }));
  };

  const handleEditComment = (commentId: string) => {
    const exactComment = document.getElementById(`${commentId}__description`);
    exactComment?.classList.add('bg-slate-200');
    exactComment?.classList.add('pointer-events-auto');
  };

  return (
    <section className='commentList__wrapper w-full flex flex-col gap-1 mt-1 mb-2'>
      {comments.length > 3 ? (
        <div className='min-h-[32px] text-sm font-semibold flex items-center '>
          <button type='button' onClick={showMoreComment}>
            More comments
          </button>
        </div>
      ) : null}

      <ul className='flex flex-col gap-1'>
        {comments.map((comment: IComment) => (
          <li className='w-full flex items-start  gap-2' key={comment._id}>
            <div className='w-8 h-8 bg-white border border-gray-200 rounded-full overflow-hidden shadow-xs'>
              <img
                className='w-full h-auto object-cover'
                src={comment.createdBy.avatarUrl}
                alt='avatar'
              />
            </div>
            <div className='flex-grow flex gap-2 '>
              <div className='commentList-comment-item__wrapper min-h-[40px] w-fit px-3 py-2 flex flex-col gap-1 rounded-md bg-slate-200 '>
                <span className='text-xs font-semibold'>
                  {comment.createdBy.name}
                </span>
                <input
                  id={`${comment._id}__description`}
                  type='text'
                  defaultValue={comment.description}
                  className='p-0 border-none focus:right-0 pointer-events-none bg-inherit rounded-full text-sm'
                />
              </div>
              {userInfo._id === comment.createdBy._id ? (
                <div className='flex items-center relative'>
                  <div
                    className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-200 cursor-pointer'
                    onClick={handleOpenManageMenu.bind(null, comment._id)}
                  >
                    <FontAwesomeIcon
                      icon={solid('ellipsis')}
                      className='commentList-comment-item__icon w-4 h-4 '
                      fixedWidth
                    />
                  </div>
                  {comment._id === manageMenuOpen && (
                    <ul className='commentList-comment-item__dropdown-menu  p-2 flex flex-col rounded-md z-20'>
                      <li
                        className='py-3 px-2 cursor-pointer hover:bg-slate-200 rounded-md'
                        onClick={handleEditComment.bind(null, comment._id)}
                      >
                        Edit
                      </li>
                      <li
                        className='py-3 px-2 cursor-pointer hover:bg-slate-200 rounded-md'
                        onClick={handleDeleteComment.bind(null, comment._id)}
                      >
                        Delete
                      </li>
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <div className='w-full flex gap-1 items-center mt-1'>
        <label
          htmlFor={`comment_${postId}`}
          className='w-8 h-8 bg-white border border-gray-200 rounded-full overflow-hidden shadow-xs'
        >
          <img
            className='w-full h-auto object-cover'
            src={userInfo.avatarUrl}
            alt='avatar'
          />
        </label>
        <input
          type='text'
          id={`comment_${postId}`}
          name='comment'
          placeholder='Comment something...'
          className='flex-grow rounded-full border-none px-3 py-2 bg-slate-200 text-sm  focus:ring-0'
          onKeyDown={handleComment}
        />
      </div>
    </section>
  );
};

export default CommentList;
