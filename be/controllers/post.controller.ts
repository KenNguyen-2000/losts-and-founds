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
import { RequestQueryOpts } from '../interfaces/common/Request';

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    const { description, location, postType }: IPost = req.body;
    const { user, files } = req;
    try {
      if (!files) {
        next(new BadRequestError('At least one image required!'));
      }
      files;
      const images: string[] = (files as Express.Multer.File[])?.map(
        (file: Express.Multer.File) => {
          return file.filename;
        }
      );
      const newPost: IPost = await postService.createPost({
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
    const {
      search = '',
      pageNo = '0',
      pageSize = '3',
      sortBy: sortByParam,
      postType,
    }: RequestQueryOpts = req.query;

    const filter = postType ? { postType } : {};

    const sortBy: any = Array.isArray(sortByParam)
      ? sortByParam.map((sort) => {
          const [field, direction] = sort.split(':');
          return [field, -1];
        })
      : [];

    try {
      const posts: IPost[] = await postService.getPostList({
        search,
        sortBy,
        pageNo: parseInt(pageNo),
        pageSize: parseInt(pageSize),
        filter,
      });

      if (posts) {
        res.status(200).json({
          message: 'Get posts list successfully!',
          posts,
          hasMore: posts.length === 0 ? false : true,
        });
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
    const { description, location, postType }: IUpdatePost = req.body;
    const { files } = req;

    let updatedFiels: IUpdatePost = {
      _id: postId,
      description,
      location,
      postType,
    };

    if (files?.length! > 0) {
      updatedFiels.images = (files as Express.Multer.File[])?.map(
        (file: Express.Multer.File) => {
          return file.filename;
        }
      );
    }
    try {
      const updatedPost: IPost = await postService.updatePost(updatedFiels);
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

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.params;
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
    description;

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
