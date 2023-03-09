import express from 'express';
import commentController from '../controllers/comment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const commentRouter = express.Router();

commentRouter
  .route('/:postId')
  .post([authMiddleware], commentController.createComment);

export default commentRouter;
