import { IComment } from './comment';
export interface IPost {
  _id: string;
  location: string;
  description: string;
  postType: string;
  images: string[];
  comments: IComment[];
  likes: PopulatedUser[];
  createdBy: PopulatedUser;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetPostRes {
  posts: IPost[];
  hasMore: boolean;
}

export interface ISearchPosts extends IPagingOpts {
  search: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
}

export interface CreatePostPayload {
  location: string;
  description: string;
  postType: string;
  images: Blob[];
}

export interface UpdatePostPayload {
  _id: string;
  location: string;
  postType: 'lost' | 'found';
  description: string;
  images?: Blob[];
}

export interface LikePostPayload {
  _id: string;
  type: string;
}

export interface LikePostRes extends IPost {
  type: string;
}

export interface IGetMorePost {
  pageNo: number;
  pageSize: number;
}

export interface IPagingOpts {
  pageNo: number;
  pageSize: number;
  filter?: string;
  search?: string;
}
