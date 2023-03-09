import { AxiosResponse } from 'axios';
import { IUser } from '../interfaces/user';
import interceptor from './interceptor';

class PostService {
  constructor() {}

  getPostList = async (): Promise<AxiosResponse> => {
    console.log('Post Service');
    const res = await interceptor.get('/posts');
    return res;
  };
}

const postService = new PostService();

export default postService;
