import { AxiosResponse } from 'axios';
import { CommentPostPayload } from '../interfaces/comment';
import {
  CreatePostPayload,
  IGetMorePost,
  IPagingOpts,
  IPost,
  LikePostPayload,
  RaisePricePayload,
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
    itemName,
  }: CreatePostPayload): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('postType', postType);
    formData.append('itemName', itemName);

    images?.forEach((file: Blob) => formData.append('images', file));
    const res = await interceptor.post<IPost>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  };

  getPostList = async (query: IPagingOpts): Promise<AxiosResponse> => {
    const res = await interceptor.get('/posts', {
      params: query,
    });
    return res;
  };

  getPostsBySearch = async (search: string): Promise<AxiosResponse> => {
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
    const res = await interceptor.get(`/posts/${_id}`);
    return res;
  };

  deletePost = async (_id: string): Promise<AxiosResponse> => {
    const res = await interceptor.delete(`/posts/${_id}`);
    return res;
  };

  updatePost = async ({
    _id,
    location,
    description,
    postType,
    images,
    itemName,
  }: UpdatePostPayload): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append('location', location);
    formData.append('description', description);
    formData.append('postType', postType);
    formData.append('itemName', itemName);

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

  raisePrice = async ({
    postId,
    priceStep,
    minPrice,
  }: RaisePricePayload): Promise<AxiosResponse> => {
    const res = await interceptor.put(`/posts/auction/raise/${postId}`, {
      priceStep: priceStep,
      minPrice: minPrice,
    });
    return res;
  };

  likePost = async ({ _id, type }: LikePostPayload): Promise<AxiosResponse> => {
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
