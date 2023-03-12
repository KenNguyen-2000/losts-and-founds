import { Types } from 'mongoose';

export interface ICreateComment {
  postId: string;
  description: string;
  userId: string;
}

export interface IEditComment {
  commentId: string;
  description: string;
}

export interface IDeleteComment {
  commentId: string;
  postId: string;
}
