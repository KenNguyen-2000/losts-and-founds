import { Express } from 'express';
export interface IUpdatePost {
  _id: string;
  title: string;
  description: string;
  location: string;
  images?: string[];
  postType: string;
}

export interface ICommentPost {
  postId: string;
  description: string;
  createdBy: string;
}

export interface ICreatePost {
  title: string;
  location: string;
  description: string;
  postType: string;
  images: string[];
  createdBy: string;
}
