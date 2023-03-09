import { Types } from 'mongoose';

export interface ICreateComment {
  postId: string;
  description: string;
  userId: string;
}
