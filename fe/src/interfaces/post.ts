import { IComment } from './comment';
export interface IPost {
  _id: string;
  title: string;
  location: string;
  description: string;
  postType: string;
  images: string[];
  comments: IComment[];
  likes: PopulatedUser[];
  createdBy: PopulatedUser;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PopulatedUser {
  _id: string;
  name: string;
}

export interface CreatePostPayload {
  title: string;
  location: string;
  description: string;
  postType: string;
  images: Blob[];
}

export interface UpdatePostPayload {
  _id: string;
  title: string;
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

export interface GetPostPayload {}
