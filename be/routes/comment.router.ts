import express from 'express';
import commentController from '../controllers/comment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const commentRouter = express.Router();

commentRouter
  .route('/:postId')
  .post([authMiddleware], commentController.createComment);
commentRouter
  .route('/:commentId')
  .put([authMiddleware], commentController.editComment);
commentRouter
  .route('/:postId/:commentId')

  .delete([authMiddleware], commentController.deleteComment);

export default commentRouter;
