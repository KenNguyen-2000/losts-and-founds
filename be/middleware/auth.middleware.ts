import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../errors/Unauthorize.error';
import jwt from 'jsonwebtoken';
import Users from '../models/user.model';
import NotFoundError from '../errors/NotFound.error';
import postService from '../services/post.service';
import ForbiddenError from '../errors/Forbidden.error';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('User are not logged in!'));
  }
  try {
    const decoded: any = await jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decoded.email);
    const user = await Users.findOne({ email: decoded.email });

    if (!user) {
      return next(new NotFoundError('User does not exist!'));
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log(error);
    return next(new UnauthorizedError('Not authorized to access this route.'));
  }
};

export const isPostOwnerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  const { user } = req;
  try {
    const post = await postService.getPost(postId);

    if (!post) {
      return next(new NotFoundError('Post id does not exist!'));
    }
    post.createdBy, user?._id;
    const isOwner = post.createdBy._id.equals(user?._id);

    if (!isOwner) {
      return next(
        new ForbiddenError('Not authorized to take action on this post')
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
