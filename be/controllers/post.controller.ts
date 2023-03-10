import { ICommentPost } from './../interfaces/dto/post.dto';
import { IPost } from './../models/post.model';
import { NextFunction, Request, Response } from 'express';
import postService from '../services/post.service';
import { IUpdatePost } from '../interfaces/dto/post.dto';
import {
  InternalServerError,
  BaseError,
  NotFoundError,
  BadRequestError,
} from '../errors/error';

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    const { title, description, location, postType }: IPost = req.body;
    const { user, files } = req;
    try {
      if (!files) {
        next(new BadRequestError('At least one image required!'));
      }
      console.log(files);
      const images: string[] = (files as Express.Multer.File[])?.map(
        (file: Express.Multer.File) => {
          return file.filename;
        }
      );
      const newPost: IPost = await postService.createPost({
        title,
        description,
        images,
        postType,
        createdBy: user?._id,
        location,
      });

      if (newPost) {
        res
          .status(201)
          .json({ post: newPost, message: 'Create post successfully!' });
      }
    } catch (error) {
      next(error);
    }
  }

  async getPostList(req: Request, res: Response, next: NextFunction) {
    try {
      const posts: IPost[] = await postService.getPostList();

      if (posts) {
        res
          .status(200)
          .json({ message: 'Get posts list successfully!', posts });
      }
    } catch (error) {
      next(error);
    }
  }

  async getCreatedPostList(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    try {
      const posts: IPost[] = await postService.getCreatedPostList(user?._id);

      if (posts) {
        res
          .status(200)
          .json({ message: 'Get posts list successfully!', posts });
      }
    } catch (error) {
      next(error);
    }
  }

  async getPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    try {
      const post: IPost = await postService.getPost(postId);
      if (post) {
        res.status(200).json({ message: 'Get post successfully!', post });
      } else {
        next(new NotFoundError('Post id does not exist!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const {
      title,
      description,
      comments,
      createdBy,
      images,
      likes,
      location,
      postType,
      status,
    }: IUpdatePost = req.body;
    try {
      const updatedPost: IPost = await postService.updatePost({
        _id: postId,
        title,
        description,
        comments,
        createdBy,
        images,
        likes,
        location,
        postType,
        status,
      });
      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Update post successfully!', post: updatedPost });
      } else {
        next(new NotFoundError('Post id does not exist!'));
      }
    } catch (error) {
      next(error);
    }
  }
  async deletPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    console.log('Delete post controller');
    try {
      await postService.deletePost(postId);
      res.status(200).json({ message: 'Delete post successfully!' });
    } catch (error) {
      next(error);
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { user } = req;

    try {
      const updatedPost = await postService.likePost(postId, user?._id);

      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Like post successfully!', post: updatedPost });
      } else {
        next(new InternalServerError('Something went wrong!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async dislikePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { user } = req;

    try {
      const updatedPost = await postService.dislikePost(postId, user?._id);
      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Dislike post successfully!', post: updatedPost });
      } else {
        next(new InternalServerError('Something went wrong!'));
      }
    } catch (error) {
      next(error);
    }
  }

  async commentPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const { description } = req.body;
    const { user } = req;
    console.log(description);

    try {
      const updatedPost = await postService.commentPost({
        postId,
        description,
        createdBy: user?._id,
      });

      if (updatedPost) {
        res
          .status(200)
          .json({ message: 'Comment post successfully!', updatedPost });
      } else {
        next(new InternalServerError('Something went wrong!'));
      }
    } catch (error) {
      next(error);
    }
  }
}

const postController = new PostController();

export default postController;
