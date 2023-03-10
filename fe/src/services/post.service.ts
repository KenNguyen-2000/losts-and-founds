import { AxiosResponse } from 'axios';
import { CommentPostPayload } from '../interfaces/comment';
import {
  CreatePostPayload,
  IPost,
  LikePostPayload,
  UpdatePostPayload,
} from '../interfaces/post';
import interceptor from './interceptor';

class PostService {
  constructor() {}

  createPost = async ({
    title,
    location,
    description,
    postType,
    images,
  }: CreatePostPayload): Promise<AxiosResponse> => {
    console.log('Create Post Service');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('description', description);

    images?.forEach((file: Blob) => formData.append('images', file));
    const res = await interceptor.post<IPost>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  };

  getPostList = async (): Promise<AxiosResponse> => {
    console.log('Get post list Service');
    const res = await interceptor.get('/posts');
    return res;
  };

  getPost = async (_id: string): Promise<AxiosResponse> => {
    console.log('Get Post Service');
    const res = await interceptor.get(`/posts/${_id}`);
    return res;
  };

  deletePost = async (_id: string): Promise<AxiosResponse> => {
    console.log('Delete Post Service');
    const res = await interceptor.delete(`/posts/${_id}`);
    return res;
  };

  updatePost = async ({
    _id,
    title,
    location,
    description,
    images,
  }: UpdatePostPayload): Promise<AxiosResponse> => {
    console.log('Update Post Service');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('description', description);

    images?.forEach((file: Blob) => formData.append('files', file));
    const res = await interceptor.put(`/posts/${_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  };

  likePost = async ({ _id, type }: LikePostPayload): Promise<AxiosResponse> => {
    console.log('Like Post Service');

    const res = await interceptor.put(`/posts/${type}/${_id}`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  };
}

const postService = new PostService();

export default postService;
