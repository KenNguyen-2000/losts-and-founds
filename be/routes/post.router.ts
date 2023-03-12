import express from 'express';
import postController from '../controllers/post.controller';
import {
  authMiddleware,
  isPostOwnerMiddleware,
} from '../middleware/auth.middleware';
import { uploadFilesMiddleware } from '../middleware/upload-img.middleware';

const postRouter = express.Router();

postRouter
  .route('/')
  .get([authMiddleware], postController.getPostList)
  .post([authMiddleware, uploadFilesMiddleware], postController.createPost);

postRouter
  .route('/losts')
  .get([authMiddleware], postController.getLostsPostList);

postRouter
  .route('/founds')
  .get([authMiddleware], postController.getFoundsPostList);

postRouter
  .route('/created')
  .get([authMiddleware], postController.getCreatedPostList);

postRouter
  .route('/:postId')
  .get([authMiddleware], postController.getPost)
  .put(
    [authMiddleware, isPostOwnerMiddleware, uploadFilesMiddleware],
    postController.updatePost
  )
  .delete([authMiddleware, isPostOwnerMiddleware], postController.deletePost);

postRouter
  .route('/like/:postId')
  .put([authMiddleware], postController.likePost);

postRouter
  .route('/dislike/:postId')
  .put([authMiddleware], postController.dislikePost);

postRouter
  .route('/comment/:postId')
  .put([authMiddleware], postController.commentPost);

export default postRouter;
