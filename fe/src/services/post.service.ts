import { AxiosResponse } from 'axios';
import { CommentPostPayload } from '../interfaces/comment';
import {
  CreatePostPayload,
  IGetMorePost,
  IPagingOpts,
  IPost,
  LikePostPayload,
  UpdatePostPayload,
} from '../interfaces/post';
import interceptor from './interceptor';

class PostService {
  constructor() {}

  createPost = async ({
    location,
    description,
    postType,
    images,
  }: CreatePostPayload): Promise<AxiosResponse> => {
    console.log('Create Post Service');
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('postType', postType);

    images?.forEach((file: Blob) => formData.append('images', file));
    const res = await interceptor.post<IPost>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  };

  getPostList = async ({
    pageNo,
    pageSize,
  }: IPagingOpts): Promise<AxiosResponse> => {
    console.log('Get post list Service');
    const res = await interceptor.get('/posts', {
      params: {
        pageNo: pageNo,
        pageSize: pageSize,
      },
    });
    return res;
  };

  getPostsBySearch = async (search: string): Promise<AxiosResponse> => {
    console.log('Get post list Service');
    const res = await interceptor.get('/posts', {
      params: {
        search: search,
        pageNo: 0,
        pageSize: 3,
      },
    });
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
    location,
    description,
    postType,
    images,
  }: UpdatePostPayload): Promise<AxiosResponse> => {
    console.log('Update Post Service');
    console.log(description);
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('postType', postType);

    if (images) {
      images?.forEach((file: Blob) => formData.append('images', file));
    }
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
