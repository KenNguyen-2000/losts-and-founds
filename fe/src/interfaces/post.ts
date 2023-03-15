import { IComment } from './comment';
export interface IPost {
  _id: string;
  itemName: string;
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
  minPrice: string;
  priceStep: string;
  raisedUser?: string;
  auctionExpired: Date;
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
  avatarUrl?: string;
  email: string;
}

export interface CreatePostPayload {
  itemName: string;
  location: string;
  description: string;
  postType: string;
  images: Blob[];
}

export interface UpdatePostPayload {
  _id: string;
  itemName: string;
  location: string;
  postType: 'lost' | 'found';
  description: string;
  images?: Blob[];
}

export interface RaisePricePayload {
  postId: string;
  priceStep: string;
  minPrice: string;
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
  sortBy?: string | string[];
  search?: string;
  postType?: string;
}
