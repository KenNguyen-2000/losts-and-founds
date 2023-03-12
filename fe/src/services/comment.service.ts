import { AxiosResponse } from 'axios';
import {
  CommentPostPayload,
  DeleteCommentPayload,
  EditCommentPayload,
} from '../interfaces/comment';
import interceptor from './interceptor';

class CommentService {
  commentPost = async ({
    description,
    postId,
  }: CommentPostPayload): Promise<AxiosResponse> => {
    console.log('Comment Post Service');

    const res = await interceptor.post(`/comments/${postId}`, {
      description,
    });
    return res;
  };
  editComment = async ({
    commentId,
    description,
  }: EditCommentPayload): Promise<AxiosResponse> => {
    console.log('Edit comment Service');

    const res = await interceptor.put(`/comments/${commentId}`, {
      description: description,
    });
    return res;
  };

  deleteComment = async ({
    commentId,
    postId,
  }: DeleteCommentPayload): Promise<AxiosResponse> => {
    console.log('Delete comment Service');

    const res = await interceptor.delete(`/comments/${postId}/${commentId}`);
    return res;
  };
}

const commentService = new CommentService();

export default commentService;
