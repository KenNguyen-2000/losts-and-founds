import { Express } from 'express';
export interface IUpdatePost {
  title: string;
  description: string;
  location: string;
  images: string[];
  createdBy?: string;
  comments?: string[];
  likes?: string[];
  status?: string;
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
  images: string[];
  createdBy: string;
}
