import { AxiosResponse } from 'axios';
import { CommentPostPayload } from '../interfaces/comment';
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
}

const commentService = new CommentService();

export default commentService;
