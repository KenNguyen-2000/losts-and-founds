import { NextFunction, Request, Response } from 'express';
import InternalServerError from '../errors/InternalServer.error';
import commentService from '../services/comment.service';

class CommentController {
  async createComment(req: Request, res: Response, next: NextFunction) {
    const { user } = req;
    const { postId } = req.params;
    const { description } = req.body;

    try {
      const comment = await commentService.createComment({
        postId,
        description,
        userId: user?._id,
      });

      if (!comment) {
        next(new InternalServerError('Comment unsuccessfully'));
      }

      res.status(201).json({ message: 'Comment successfully!', comment });
    } catch (error) {
      next(error);
    }
  }
}

const commentController = new CommentController();

export default commentController;
