import { Express } from 'express';
export interface IUpdatePost {
  _id: string;
  itemName: String;
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
  itemName: string;
  location: string;
  description: string;
  postType: string;
  images: string[];
  createdBy: string;
}
